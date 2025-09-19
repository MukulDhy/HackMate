import {
    Clock as IconClock,
    Mic as IconMic,
    MicOff as IconMicOff,
    Send as IconSend,
    Upload as IconUpload,
    Users as IconUsers,
    Video as IconVideo,
    VideoOff as IconVideoOff,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import {
    closeSubmit,
    openSubmit,
    sendMessage,
    setDraft,
    setFormGit,
    setFormMembers,
    setFormZip,
    setSubmitting,
    tick,
    toggleCam,
    toggleMic,
} from '../slices/hackathonSlice';

import { RootState } from '../store/store';

/* ----------------------------- Utilities ------------------------------- */
const pad2 = (n: number) => String(n).padStart(2, '0');
const formatHMS = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
};

/* ----------------------------- Small UI Bits --------------------------- */
function Card({
    children,
    className = '',
}: React.PropsWithChildren<{ className?: string }>) {
    return (
        <div
            className={`rounded-2xl bg-white/4 border border-white/6 p-4 ${className}`}
        >
            {children}
        </div>
    );
}

/* ------------------------------ Page UI -------------------------------- */
export default function HackathonPage(): JSX.Element {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const {
        secondsLeft,
        micOn,
        camOn,
        messages,
        draft,
        submitOpen,
        submitting,
        formMembers,
        formGit,
        formZip,
        team,
    } = useAppSelector((state: RootState) => state.hackathon);

    // Timer tick
    useEffect(() => {
        const id = setInterval(() => dispatch(tick()), 1000);
        return () => clearInterval(id);
    }, [dispatch]);

    // Media stream (local only)
    const localStreamRef = useRef<MediaStream | null>(null);
    const videoElsRef = useRef<Array<HTMLVideoElement | null>>([
        null,
        null,
        null,
        null,
    ]);

    const startLocalStream = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            localStreamRef.current = stream;
            const vid = videoElsRef.current[0];
            if (vid) vid.srcObject = stream;
            stream.getAudioTracks().forEach((t) => (t.enabled = micOn));
            stream.getVideoTracks().forEach((t) => (t.enabled = camOn));
        } catch (err) {
            console.warn('getUserMedia failed:', err);
        }
    }, [micOn, camOn]);

    useEffect(() => {
        startLocalStream();
        return () => {
            localStreamRef.current?.getTracks().forEach((t) => t.stop());
            localStreamRef.current = null;
        };
    }, [startLocalStream]);

    useEffect(() => {
        const s = localStreamRef.current;
        if (!s) return;
        s.getAudioTracks().forEach((t) => (t.enabled = micOn));
    }, [micOn]);

    useEffect(() => {
        const s = localStreamRef.current;
        if (!s) return;
        s.getVideoTracks().forEach((t) => (t.enabled = camOn));
    }, [camOn]);

    /* -------------------------- Submit handler --------------------------- */
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (!formMembers.trim() || !formGit.trim()) {
            alert('Please fill team members and GitHub repo link.');
            return;
        }
        dispatch(setSubmitting(true));

        await new Promise((r) => setTimeout(r, 700));

        const payload = {
            teamMembers: formMembers,
            repo: formGit,
            zip: formZip ? { name: formZip.name, size: formZip.size } : null,
            time: new Date().toISOString(),
            secondsLeft,
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hackmate_submission_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        dispatch(setSubmitting(false));
        dispatch(closeSubmit());
        navigate('/dashboard');
    };

    const videoTiles = [0, 1, 2, 3];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#05040a] via-[#071022] to-[#020617] text-white p-6">
            {/* Header */}
            <header className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 grid place-items-center font-bold shadow-lg">
                        HM
                    </div>
                    <div>
                        <div className="text-sm text-white/70">HackMate</div>
                        <div className="font-extrabold text-lg">
                            AI Innovation Challenge — Team Room
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/6 font-mono">
                        {formatHMS(secondsLeft)}
                    </div>
                    <button
                        onClick={() => navigate('/hackathon/chat')}
                        className="px-3 py-2 rounded-lg bg-cyan-600/80 hover:bg-cyan-600 text-white font-semibold"
                        title="Switch to Modern Chat View"
                    >
                        Modern View
                    </button>
                    <button
                        onClick={() => window.location.assign('/dashboard')}
                        className="px-3 py-2 rounded-lg bg-white/6 hover:bg-white/8 text-white font-semibold"
                        title="Go to Dashboard"
                    >
                        Dashboard
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
                {/* Left: Info / Team / Timer */}
                <section className="col-span-4 space-y-6">
                    <Card>
                        <div className="flex items-start gap-3">
                            <div className="text-2xl">🚀</div>
                            <div>
                                <h3 className="font-semibold text-lg">
                                    Hackathon Details
                                </h3>
                                <p className="text-sm text-white/70 mt-2">
                                    Build an AI-powered collaboration tool. Use
                                    the team room for voice/video, chat, and
                                    submit your final code before the timer
                                    ends.
                                </p>
                                <ul className="text-xs mt-3 space-y-1 text-white/60">
                                    <li>• Theme: Future of Collaboration</li>
                                    <li>• Max team size: 4</li>
                                    <li>• Submission: GitHub or ZIP</li>
                                </ul>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <IconUsers className="w-5 h-5 text-cyan-300" />
                                <h4 className="font-semibold">Team</h4>
                            </div>
                            <div className="text-xs text-white/60">
                                {team.length} members
                            </div>
                        </div>

                        <ul className="mt-3 space-y-3">
                            {team.map((m) => (
                                <li
                                    key={m.id}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-700 to-purple-600 grid place-items-center text-white font-bold text-sm">
                                            {m.name
                                                .split(' ')
                                                .map((p) => p[0])
                                                .slice(0, 2)
                                                .join('')}
                                        </div>
                                        <div>
                                            <div className="font-medium">
                                                {m.name}
                                            </div>
                                            <div className="text-xs text-white/60">
                                                {m.status}
                                            </div>
                                        </div>
                                    </div>
                                    <span
                                        className={`w-3 h-3 rounded-full ${
                                            m.status === 'active'
                                                ? 'bg-emerald-400'
                                                : m.status === 'away'
                                                ? 'bg-yellow-400'
                                                : 'bg-gray-500'
                                        } ring-1 ring-white/10`}
                                    />
                                </li>
                            ))}
                        </ul>
                    </Card>

                    <Card className="text-center">
                        <div className="flex items-center justify-center gap-3">
                            <IconClock className="w-5 h-5 text-cyan-300" />
                            <div>
                                <div className="text-xs text-white/60">
                                    Time Left
                                </div>
                                <div className="font-mono text-xl mt-1">
                                    {formatHMS(secondsLeft)}
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Right: Video + Chat + Submit */}
                <section className="col-span-8 space-y-6">
                    {/* Video grid */}
                    <div className="grid grid-cols-2 gap-4 h-[440px]">
                        {videoTiles.map((tileIdx) => (
                            <div
                                key={tileIdx}
                                className="relative rounded-xl overflow-hidden bg-black/60 border border-white/6"
                            >
                                <video
                                    ref={(el) =>
                                        (videoElsRef.current[tileIdx] = el)
                                    }
                                    autoPlay
                                    muted={tileIdx === 0}
                                    playsInline
                                    className="w-full h-full object-cover bg-black"
                                />
                                <div className="absolute left-3 top-3 px-2 py-1 bg-black/40 rounded-md text-xs">
                                    {tileIdx === 0
                                        ? 'You (local)'
                                        : `Participant ${tileIdx + 1}`}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => dispatch(toggleMic())}
                            className={`p-3 rounded-full shadow-md ${
                                micOn ? 'bg-emerald-600/80' : 'bg-red-600/70'
                            }`}
                        >
                            {micOn ? (
                                <IconMic className="w-5 h-5" />
                            ) : (
                                <IconMicOff className="w-5 h-5" />
                            )}
                        </button>

                        <button
                            onClick={() => dispatch(toggleCam())}
                            className={`p-3 rounded-full shadow-md ${
                                camOn ? 'bg-emerald-600/80' : 'bg-red-600/70'
                            }`}
                        >
                            {camOn ? (
                                <IconVideo className="w-5 h-5" />
                            ) : (
                                <IconVideoOff className="w-5 h-5" />
                            )}
                        </button>

                        <div className="ml-4 text-sm text-white/60">
                            Mic: {micOn ? 'On' : 'Off'} • Cam:{' '}
                            {camOn ? 'On' : 'Off'}
                        </div>
                    </div>

                    {/* Chat + Submit */}
                    <div className="grid grid-cols-3 gap-4">
                        {/* Chat */}
                        <Card className="col-span-2 flex flex-col h-[240px]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <IconSend className="w-4 h-4 text-cyan-300" />
                                    <h4 className="font-semibold">Team Chat</h4>
                                </div>
                                <div className="text-xs text-white/60">
                                    {messages.length} messages
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto mt-3 space-y-2 px-1">
                                {messages.length === 0 ? (
                                    <div className="text-xs text-white/60 italic">
                                        No messages yet — start the
                                        conversation.
                                    </div>
                                ) : (
                                    messages.map((m) => (
                                        <div
                                            key={m.id}
                                            className="bg-white/6 p-2 rounded-md text-sm"
                                        >
                                            <div className="text-xs text-white/60">
                                                {m.user} •{' '}
                                                {new Date(
                                                    m.ts,
                                                ).toLocaleTimeString()}
                                            </div>
                                            <div>{m.text}</div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="mt-3 flex gap-2">
                                <input
                                    value={draft}
                                    onChange={(e) =>
                                        dispatch(setDraft(e.target.value))
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            (e.ctrlKey || e.metaKey) &&
                                            e.key.toLowerCase() === 'enter'
                                        )
                                            dispatch(sendMessage());
                                    }}
                                    placeholder="Write a message — Ctrl/Cmd+Enter to send"
                                    className="flex-1 px-3 py-2 rounded-md bg-black/40 outline-none"
                                />
                                <button
                                    onClick={() => dispatch(sendMessage())}
                                    className="px-4 py-2 bg-cyan-500 rounded-md"
                                >
                                    Send
                                </button>
                            </div>
                        </Card>

                        {/* Submit */}
                        <Card className="col-span-1 flex flex-col justify-between h-[240px]">
                            <div>
                                <h4 className="font-semibold">
                                    Finalize & Submit
                                </h4>
                                <p className="text-xs text-white/60 mt-2">
                                    When your team is ready, submit the project
                                    (GitHub link or zip). The form opens only on
                                    click.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                                <button
                                    onClick={() => dispatch(openSubmit())}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-md"
                                >
                                    Submit
                                </button>
                            </div>
                        </Card>
                    </div>
                </section>
            </main>

            {/* Submit Modal */}
            {submitOpen && (
                <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-[#071022] p-6 rounded-2xl w-full max-w-lg border border-white/6 shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">
                                Submit Project
                            </h3>
                            <button
                                type="button"
                                onClick={() => dispatch(closeSubmit())}
                                className="text-xs text-white/60"
                            >
                                Close
                            </button>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm">
                                Team Members (comma separated)
                            </label>
                            <input
                                value={formMembers}
                                onChange={(e) =>
                                    dispatch(setFormMembers(e.target.value))
                                }
                                className="w-full p-2 rounded-md bg-black/40"
                                required
                            />

                            <label className="block text-sm">
                                GitHub Repository
                            </label>
                            <input
                                value={formGit}
                                onChange={(e) =>
                                    dispatch(setFormGit(e.target.value))
                                }
                                placeholder="https://github.com/your-repo"
                                className="w-full p-2 rounded-md bg-black/40"
                                required
                            />

                            <label className="block text-sm">
                                Upload ZIP (optional)
                            </label>
                            <input
                                type="file"
                                accept=".zip"
                                onChange={(e) =>
                                    dispatch(
                                        setFormZip(
                                            e.target.files
                                                ? e.target.files[0]
                                                : null,
                                        ),
                                    )
                                }
                                className="w-full"
                            />
                        </div>

                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => dispatch(closeSubmit())}
                                className="px-3 py-2 rounded-md bg-white/6"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-4 py-2 rounded-md bg-emerald-500"
                            >
                                {submitting ? (
                                    'Submitting…'
                                ) : (
                                    <>
                                        <IconUpload className="inline-block w-4 h-4 mr-2" />{' '}
                                        Submit
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

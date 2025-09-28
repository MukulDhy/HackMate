import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { RootState } from '@/store/index';
import type { User } from '@/store/slices/authSlice';
import { hackathonEnded } from '@/store/slices/websocketSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

type Rating = 1 | 2 | 3 | 4 | 5;
type Likelihood = number; // 1-10
type Expectations = 'yes' | 'no' | 'partially';

interface FeedbackFormFields {
    // Event Experience
    overallSatisfaction: Rating;
    easeOfRegistration: Rating;
    platformSmoothness: Rating;

    // Content & Activities
    problemClarity: Rating;
    mentorsHelpfulness: Rating;
    judgingFairness: Rating;

    // Logistics & Tools
    submissionUsability: Rating;
    technicalSupportAvailability: Rating;
    networkingQuality: Rating;

    // Outcomes
    metExpectations: Expectations;
    participateAgain: Likelihood;
    recommendLikelihood: Likelihood;

    // Open Feedback
    likedMost?: string;
    improvements?: string;
}

const defaultForm: FeedbackFormFields = {
    overallSatisfaction: 5,
    easeOfRegistration: 5,
    platformSmoothness: 5,
    problemClarity: 5,
    mentorsHelpfulness: 5,
    judgingFairness: 5,
    submissionUsability: 5,
    technicalSupportAvailability: 5,
    networkingQuality: 5,
    metExpectations: 'yes',
    participateAgain: 8,
    recommendLikelihood: 8,
};

function RatingControl({
    value,
    onChange,
}: {
    value: Rating;
    onChange: (v: Rating) => void;
}) {
    return (
        <div className="flex gap-2" role="radiogroup" aria-label="rating">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    aria-pressed={n <= value}
                    onClick={() => onChange(n as Rating)}
                    className={`px-2 py-1 rounded-md ${
                        n <= value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                    }`}
                >
                    {n}
                </button>
            ))}
        </div>
    );
}

function RangeControl({
    value,
    onChange,
    min = 1,
    max = 10,
}: {
    value: number;
    onChange: (n: number) => void;
    min?: number;
    max?: number;
}) {
    return (
        <div>
            <input
                aria-label="range"
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full"
            />
            <div className="text-sm">{value}</div>
        </div>
    );
}

function RadioGroup<T extends string>({
    value,
    options,
    onChange,
}: {
    value: T;
    options: { value: T; label: string }[];
    onChange: (v: T) => void;
}) {
    return (
        <div className="flex gap-2">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={`px-3 py-1 rounded-md ${
                        value === opt.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

export default function ModalFeedbackForm() {
    const hackathonId = useSelector(
        (s: RootState) => s.websocket.pendingFeedbackHackathonId,
    );
    const user = useSelector((s: RootState) => s.auth.user as User | null);
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState<FeedbackFormFields>(defaultForm);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setOpen(Boolean(hackathonId));
    }, [hackathonId]);

    useEffect(() => {
        if (open) {
            setForm(defaultForm);
        }
    }, [open]);

    const update = <K extends keyof FeedbackFormFields>(
        key: K,
        value: FeedbackFormFields[K],
    ) => {
        setForm((s) => ({ ...s, [key]: value }));
    };

    const clearAndClose = () => {
        dispatch(hackathonEnded({ hackathonId: null }));
        setOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hackathonId) return;
        setIsSubmitting(true);

        const payload: Record<string, unknown> = {
            // include user info from auth state, not from form inputs
            email: user?.email,
            name: user?.name,

            overallSatisfaction: form.overallSatisfaction,
            easeOfRegistration: form.easeOfRegistration,
            platformSmoothness: form.platformSmoothness,
            problemClarity: form.problemClarity,
            mentorsHelpfulness: form.mentorsHelpfulness,
            judgingFairness: form.judgingFairness,
            submissionUsability: form.submissionUsability,
            technicalSupportAvailability: form.technicalSupportAvailability,
            networkingQuality: form.networkingQuality,
            metExpectations: form.metExpectations,
            participateAgain: form.participateAgain,
            recommendLikelihood: form.recommendLikelihood,
            likedMost: form.likedMost || undefined,
            improvements: form.improvements || undefined,
        };

        try {
            const base = (import.meta.env.VITE_API_URL as string) || '';
            const token = localStorage.getItem('token');
            const res = await fetch(
                `${base}/api/hackathons/${hackathonId}/feedback`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify(payload),
                },
            );

            if (!res.ok) throw new Error('Failed to submit feedback');

            clearAndClose();
            navigate('/dashboard');
        } catch (err) {
            console.error('Feedback submit error', err);
            clearAndClose();
            navigate('/dashboard');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                if (!v) clearAndClose();
                setOpen(v);
            }}
        >
            <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogTitle>Hackathon Feedback</DialogTitle>
                <DialogDescription>
                    The hackathon has ended — please take a moment to share your
                    feedback. You will be redirected to the dashboard after
                    submitting.
                </DialogDescription>

                <form
                    onSubmit={handleSubmit}
                    className="mt-4 space-y-4 max-h-[70vh] overflow-auto"
                >
                    <section className="space-y-2">
                        <h3 className="font-medium">1. Event Experience</h3>
                        <label className="text-sm">
                            Overall satisfaction rating
                        </label>
                        <RatingControl
                            value={form.overallSatisfaction}
                            onChange={(v) => update('overallSatisfaction', v)}
                        />

                        <label className="text-sm">
                            Ease of registration process
                        </label>
                        <RatingControl
                            value={form.easeOfRegistration}
                            onChange={(v) => update('easeOfRegistration', v)}
                        />

                        <label className="text-sm">
                            Smoothness of online platform experience
                        </label>
                        <RatingControl
                            value={form.platformSmoothness}
                            onChange={(v) => update('platformSmoothness', v)}
                        />
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-medium">
                            2. Hackathon Content & Activities
                        </h3>
                        <label className="text-sm">
                            Relevance and clarity of problem statements
                        </label>
                        <RatingControl
                            value={form.problemClarity}
                            onChange={(v) => update('problemClarity', v)}
                        />

                        <label className="text-sm">
                            Helpfulness of mentors
                        </label>
                        <RatingControl
                            value={form.mentorsHelpfulness}
                            onChange={(v) => update('mentorsHelpfulness', v)}
                        />

                        <label className="text-sm">
                            Fairness of the judging process
                        </label>
                        <RatingControl
                            value={form.judgingFairness}
                            onChange={(v) => update('judgingFairness', v)}
                        />
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-medium">3. Logistics & Tools</h3>
                        <label className="text-sm">
                            Usability of submission system
                        </label>
                        <RatingControl
                            value={form.submissionUsability}
                            onChange={(v) => update('submissionUsability', v)}
                        />

                        <label className="text-sm">
                            Availability of technical support
                        </label>
                        <RatingControl
                            value={form.technicalSupportAvailability}
                            onChange={(v) =>
                                update('technicalSupportAvailability', v)
                            }
                        />

                        <label className="text-sm">
                            Quality of networking opportunities
                        </label>
                        <RatingControl
                            value={form.networkingQuality}
                            onChange={(v) => update('networkingQuality', v)}
                        />
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-medium">4. Outcomes</h3>
                        <label className="text-sm">
                            Did the hackathon meet your expectations?
                        </label>
                        <RadioGroup
                            value={form.metExpectations}
                            options={[
                                { value: 'yes', label: 'Yes' },
                                { value: 'partially', label: 'Partially' },
                                { value: 'no', label: 'No' },
                            ]}
                            onChange={(v) => update('metExpectations', v)}
                        />

                        <label className="text-sm">
                            Likelihood of participating again (1-10)
                        </label>
                        <RangeControl
                            value={form.participateAgain}
                            onChange={(v) => update('participateAgain', v)}
                            min={1}
                            max={10}
                        />

                        <label className="text-sm">
                            Likelihood of recommending to a friend (1-10)
                        </label>
                        <RangeControl
                            value={form.recommendLikelihood}
                            onChange={(v) => update('recommendLikelihood', v)}
                            min={1}
                            max={10}
                        />
                    </section>

                    <section className="space-y-2">
                        <h3 className="font-medium">5. Open Feedback</h3>
                        <label className="text-sm">
                            What did you like the most about the hackathon?
                        </label>
                        <textarea
                            value={form.likedMost ?? ''}
                            onChange={(e) =>
                                update('likedMost', e.target.value)
                            }
                            rows={3}
                            className="w-full px-3 py-2 bg-input border border-border rounded-md"
                        />

                        <label className="text-sm">
                            What could be improved for future editions?
                        </label>
                        <textarea
                            value={form.improvements ?? ''}
                            onChange={(e) =>
                                update('improvements', e.target.value)
                            }
                            rows={3}
                            className="w-full px-3 py-2 bg-input border border-border rounded-md"
                        />
                    </section>

                    <div className="flex items-center justify-end gap-3">
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                onClick={clearAndClose}
                                type="button"
                            >
                                Dismiss
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Submit Feedback'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
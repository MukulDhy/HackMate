export default function LobbyDetailsPanel({
    lobbyName,
    capacity,
    joined,
    countdown,
    theme,
}: {
    lobbyName: string;
    capacity: number;
    joined: number;
    countdown: number;
    theme: string | null;
}) {
    return (
        <div className="absolute top-8 left-8 z-10 p-6 rounded-2xl glass-card neon-glow min-w-[320px]">
            <h1 className="font-orbitron text-2xl mb-2">{lobbyName}</h1>
            <div className="mb-1">
                Members:{' '}
                <span className="font-bold">
                    {joined}/{capacity}
                </span>
            </div>
            <div className="mb-1">
                Countdown: <span className="font-bold">{countdown}s</span>
            </div>
            <div>
                Theme:{' '}
                {theme ? (
                    <span className="font-bold text-neon-cyan">{theme}</span>
                ) : (
                    <span className="opacity-50">Hidden</span>
                )}
            </div>
        </div>
    );
}

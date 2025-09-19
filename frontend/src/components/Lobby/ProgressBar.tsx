export default function ProgressBar({
    value,
    max,
}: {
    value: number;
    max: number;
}) {
    const percent = (value / max) * 100;
    return (
        <div className="w-72 h-4 bg-glass rounded-full overflow-hidden shadow-inner border border-glass-border">
            <div
                className="h-full bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-lime neon-glow transition-all"
                style={{ width: `${percent}%` }}
            />
        </div>
    );
}

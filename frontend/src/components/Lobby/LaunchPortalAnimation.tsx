import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';

export default function LaunchPortalAnimation({
    onComplete,
}: {
    onComplete: () => void;
}) {
    useEffect(() => {
        const t = setTimeout(onComplete, 2000);
        return () => clearTimeout(t);
    }, [onComplete]);
    return (
        <div className="fixed inset-0 z-50">
            <Canvas camera={{ position: [0, 3, 10], fov: 60 }}>
                <ambientLight intensity={1} />
                <pointLight position={[0, 10, 0]} intensity={2} />
                <Suspense fallback={null}>
                    {/* Morphing table to portal animation goes here */}
                </Suspense>
            </Canvas>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-orbitron text-5xl text-neon-cyan neon-glow animate-pulse-glow">
                    Launching Hackathon...
                </span>
            </div>
        </div>
    );
}

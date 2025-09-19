import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

export interface Member {
    id: number;
    name: string;
    avatar: string;
}

export default function WaitingRoom3DScene({ members }: { members: Member[] }) {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 3, 10], fov: 60 }}>
                <ambientLight intensity={0.8} />
                <pointLight position={[0, 10, 0]} intensity={1.5} />
                <Suspense fallback={null}>
                    {/* Hologram table and avatars go here */}
                </Suspense>
            </Canvas>
        </div>
    );
}

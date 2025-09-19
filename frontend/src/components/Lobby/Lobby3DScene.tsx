import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

export default function Lobby3DScene() {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
                <ambientLight intensity={0.7} />
                <pointLight position={[10, 10, 10]} intensity={1.2} />
                <Suspense fallback={null}>
                    {/* 🎨 Place your 3D lobby room model here (e.g., <LobbyRoom />) */}
                </Suspense>
            </Canvas>
        </div>
    );
}

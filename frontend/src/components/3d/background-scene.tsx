import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { FloatingShapes } from './floating-shapes';
import { NebulaEffect } from './nebula-effect';
import { ParticleTrails } from './particle-trails';

function CameraController() {
    const cameraRef = useRef<THREE.Camera>();

    useFrame((state) => {
        if (state.camera) {
            // Very subtle camera movement for immersive effect without distraction
            const time = state.clock.elapsedTime;
            state.camera.position.x = Math.sin(time * 0.05) * 0.2;
            state.camera.position.y = Math.cos(time * 0.07) * 0.15;
            state.camera.lookAt(0, 0, 0);
        }
    });

    return null;
}

interface BackgroundSceneProps {
    className?: string;
}

export function BackgroundScene({ className }: BackgroundSceneProps) {
    return (
        <div className={className}>
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
                gl={{ alpha: true, antialias: true }}
                dpr={[1, 2]}
            >
                <Suspense fallback={null}>
                    <CameraController />
                    {/* <NebulaEffect /> */}
                    <ParticleTrails />
                    <Stars
                        radius={300}
                        depth={150}
                        count={6000}
                        factor={6}
                        saturation={0.7}
                        fade={true}
                        speed={0.3}
                    />
                    <FloatingShapes />
                    {/* Reduced auto-rotation for better readability */}
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        enableRotate={true}
                        autoRotate={true}
                        autoRotateSpeed={0.05}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}

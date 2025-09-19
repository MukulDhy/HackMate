import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { Mesh } from 'three';

export function NebulaEffect() {
    const nebulaRef = useRef<Mesh>(null);
    const nebula2Ref = useRef<Mesh>(null);
    const nebula3Ref = useRef<Mesh>(null);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // First nebula layer - more subtle
        if (nebulaRef.current) {
            nebulaRef.current.rotation.z += 0.0008;
            const material = nebulaRef.current
                .material as THREE.MeshBasicMaterial;
            if (material && material.opacity !== undefined) {
                material.opacity = 0.03 + Math.sin(time * 0.3) * 0.015;
            }
        }

        // Second nebula layer - more subtle
        if (nebula2Ref.current) {
            nebula2Ref.current.rotation.z -= 0.0005;
            const material = nebula2Ref.current
                .material as THREE.MeshBasicMaterial;
            if (material && material.opacity !== undefined) {
                material.opacity = 0.025 + Math.cos(time * 0.2) * 0.01;
            }
        }

        // Third nebula layer - more subtle
        if (nebula3Ref.current) {
            nebula3Ref.current.rotation.z += 0.0006;
            const material = nebula3Ref.current
                .material as THREE.MeshBasicMaterial;
            if (material && material.opacity !== undefined) {
                material.opacity = 0.02 + Math.sin(time * 0.4) * 0.008;
            }
        }
    });

    return (
        <>
            {/* Primary nebula */}
            <mesh ref={nebulaRef} position={[0, 0, -15]}>
                <planeGeometry args={[60, 60]} />
                <meshBasicMaterial
                    color="#4A00E0"
                    transparent
                    opacity={0.03}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Secondary nebula */}
            <mesh ref={nebula2Ref} position={[5, -3, -18]}>
                <planeGeometry args={[40, 40]} />
                <meshBasicMaterial
                    color="#E0004A"
                    transparent
                    opacity={0.025}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Tertiary nebula */}
            <mesh ref={nebula3Ref} position={[-8, 2, -20]}>
                <planeGeometry args={[35, 35]} />
                <meshBasicMaterial
                    color="#00E0A0"
                    transparent
                    opacity={0.02}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </>
    );
}

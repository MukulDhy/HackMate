import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export function ParticleTrails() {
    const particlesRef = useRef<THREE.Points>(null);
    const particleCount = 100; // Reduced particle count for better readability

    const particlesData = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Random initial positions
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;

            // Slower velocities for less distraction
            velocities[i3] = (Math.random() - 0.5) * 0.01;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

            // Random neon colors
            const colorChoice = Math.random();
            if (colorChoice < 0.2) {
                colors[i3] = 0;
                colors[i3 + 1] = 1;
                colors[i3 + 2] = 1; // Cyan
            } else if (colorChoice < 0.4) {
                colors[i3] = 1;
                colors[i3 + 1] = 0;
                colors[i3 + 2] = 1; // Magenta
            } else if (colorChoice < 0.6) {
                colors[i3] = 0.5;
                colors[i3 + 1] = 1;
                colors[i3 + 2] = 0; // Lime
            } else if (colorChoice < 0.8) {
                colors[i3] = 0.5;
                colors[i3 + 1] = 0;
                colors[i3 + 2] = 1; // Purple
            } else {
                colors[i3] = 1;
                colors[i3 + 1] = 0.5;
                colors[i3 + 2] = 0; // Orange
            }
        }

        return { positions, velocities, colors };
    }, []);

    useFrame((state) => {
        if (particlesRef.current) {
            const positions = particlesRef.current.geometry.attributes.position
                .array as Float32Array;
            const time = state.clock.elapsedTime;

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;

                // Gentler movement for better readability
                positions[i3] +=
                    particlesData.velocities[i3] +
                    Math.sin(time + i * 0.1) * 0.0005;
                positions[i3 + 1] +=
                    particlesData.velocities[i3 + 1] +
                    Math.cos(time + i * 0.1) * 0.0005;
                positions[i3 + 2] += particlesData.velocities[i3 + 2];

                // Wrap around boundaries
                if (positions[i3] > 15) positions[i3] = -15;
                if (positions[i3] < -15) positions[i3] = 15;
                if (positions[i3 + 1] > 15) positions[i3 + 1] = -15;
                if (positions[i3 + 1] < -15) positions[i3 + 1] = 15;
                if (positions[i3 + 2] > 15) positions[i3 + 2] = -15;
                if (positions[i3 + 2] < -15) positions[i3 + 2] = 15;
            }

            particlesRef.current.geometry.attributes.position.needsUpdate =
                true;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={particlesData.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particleCount}
                    array={particlesData.colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                vertexColors
                transparent
                opacity={0.3}
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { Mesh } from 'three';

interface FloatingShapeProps {
    position: [number, number, number];
    color: string;
    speed?: number;
    shape: 'box' | 'sphere' | 'octahedron';
    scale?: number;
}

export function FloatingShape({
    position,
    color,
    speed = 1,
    shape,
    scale = 1,
}: FloatingShapeProps) {
    const meshRef = useRef<Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Reduced rotation speeds for less distraction
            meshRef.current.rotation.x += 0.005 * speed;
            meshRef.current.rotation.y += 0.006 * speed;
            meshRef.current.rotation.z += 0.004 * speed;

            // Gentler orbital motion for better readability
            const time = state.clock.elapsedTime;
            meshRef.current.position.y =
                position[1] +
                Math.sin(time * speed * 0.5) * 0.3 +
                Math.cos(time * speed * 0.2) * 0.1;
            meshRef.current.position.x =
                position[0] +
                Math.cos(time * speed * 0.3) * 0.2 +
                Math.sin(time * speed * 0.4) * 0.08;
            meshRef.current.position.z =
                position[2] + Math.sin(time * speed * 0.2) * 0.15;

            // Subtle pulsing scale animation
            const pulseFactor = 1 + Math.sin(time * speed * 1.5) * 0.05;
            meshRef.current.scale.setScalar(scale * pulseFactor);
        }
    });

    const geometryMap = {
        box: <boxGeometry args={[0.8 * scale, 0.8 * scale, 0.8 * scale]} />,
        sphere: <sphereGeometry args={[0.4 * scale, 32, 32]} />,
        octahedron: <octahedronGeometry args={[0.5 * scale]} />,
    };

    return (
        <mesh ref={meshRef} position={position}>
            {geometryMap[shape]}
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.15}
                transparent
                opacity={0.4}
                roughness={0.5}
                metalness={0.5}
                wireframe={false}
            />
        </mesh>
    );
}

export function FloatingShapes() {
    return (
        <>
            {/* Primary floating elements - larger and more prominent */}
            <FloatingShape
                position={[-4, 2, -3]}
                color="#00ffff"
                shape="octahedron"
                speed={0.6}
                scale={1.5}
            />
            <FloatingShape
                position={[4, -1, -4]}
                color="#ff00ff"
                shape="sphere"
                speed={0.8}
                scale={1.3}
            />
            <FloatingShape
                position={[0, 4, -5]}
                color="#80ff00"
                shape="box"
                speed={0.5}
                scale={1.4}
            />
            <FloatingShape
                position={[-3, -3, -2]}
                color="#8000ff"
                shape="octahedron"
                speed={1.2}
                scale={1.2}
            />
            <FloatingShape
                position={[5, 2, -3]}
                color="#00ff80"
                shape="sphere"
                speed={0.7}
                scale={1.3}
            />

            {/* Secondary medium elements */}
            <FloatingShape
                position={[-6, 0, -6]}
                color="#ff8000"
                shape="box"
                speed={0.9}
                scale={1.0}
            />
            <FloatingShape
                position={[2, -4, -3]}
                color="#ff0080"
                shape="octahedron"
                speed={1.1}
                scale={0.9}
            />
            <FloatingShape
                position={[-1, 5, -4]}
                color="#0080ff"
                shape="sphere"
                speed={0.6}
                scale={1.1}
            />
            <FloatingShape
                position={[6, -2, -5]}
                color="#80ff80"
                shape="box"
                speed={0.8}
                scale={1.0}
            />
            <FloatingShape
                position={[-5, 3, -2]}
                color="#ff80ff"
                shape="octahedron"
                speed={1.0}
                scale={0.8}
            />

            {/* Distant background elements - smaller */}
            <FloatingShape
                position={[-8, 1, -8]}
                color="#4080ff"
                shape="sphere"
                speed={0.4}
                scale={0.6}
            />
            <FloatingShape
                position={[8, 3, -7]}
                color="#ff4080"
                shape="box"
                speed={0.3}
                scale={0.5}
            />
            <FloatingShape
                position={[0, -6, -6]}
                color="#80ff40"
                shape="octahedron"
                speed={0.5}
                scale={0.7}
            />

            {/* Tiny particles - very small and distant */}
            <FloatingShape
                position={[-10, 4, -10]}
                color="#60c0ff"
                shape="sphere"
                speed={0.2}
                scale={0.3}
            />
            <FloatingShape
                position={[10, -5, -9]}
                color="#ff60c0"
                shape="octahedron"
                speed={0.3}
                scale={0.2}
            />
            <FloatingShape
                position={[7, 6, -8]}
                color="#c0ff60"
                shape="box"
                speed={0.25}
                scale={0.3}
            />

            {/* Enhanced lighting for space atmosphere with animations */}
            <AnimatedLights />
        </>
    );
}

function AnimatedLights() {
    const light1Ref = useRef<THREE.PointLight>(null);
    const light2Ref = useRef<THREE.PointLight>(null);
    const light3Ref = useRef<THREE.PointLight>(null);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        if (light1Ref.current) {
            light1Ref.current.intensity = 0.6 + Math.sin(time * 1.5) * 0.15;
            light1Ref.current.position.x = Math.cos(time * 0.3) * 2;
            light1Ref.current.position.y = Math.sin(time * 0.4) * 1.5;
        }

        if (light2Ref.current) {
            light2Ref.current.intensity = 0.4 + Math.cos(time * 1.2) * 0.1;
            light2Ref.current.position.x = -8 + Math.sin(time * 0.2) * 1.5;
            light2Ref.current.position.z = 2 + Math.cos(time * 0.25) * 0.8;
        }

        if (light3Ref.current) {
            light3Ref.current.intensity = 0.35 + Math.sin(time * 1.3) * 0.1;
            light3Ref.current.position.y = -8 + Math.cos(time * 0.35) * 1.5;
            light3Ref.current.position.x = 8 + Math.sin(time * 0.15) * 0.8;
        }
    });

    return (
        <>
            <ambientLight intensity={0.15} color="#001122" />
            <pointLight
                ref={light1Ref}
                position={[0, 0, 8]}
                intensity={0.6}
                color="#00ffff"
                distance={20}
                decay={2}
            />
            <pointLight
                ref={light2Ref}
                position={[-8, 8, 2]}
                intensity={0.4}
                color="#ff00ff"
                distance={15}
                decay={2}
            />
            <pointLight
                ref={light3Ref}
                position={[8, -8, 4]}
                intensity={0.35}
                color="#80ff00"
                distance={18}
                decay={2}
            />
            <directionalLight
                position={[10, 10, 10]}
                intensity={0.2}
                color="#ffffff"
            />
            <spotLight
                position={[0, 15, 5]}
                intensity={0.4}
                color="#8000ff"
                angle={Math.PI / 3}
                penumbra={0.8}
                decay={2}
                distance={25}
            />
        </>
    );
}

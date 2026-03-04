'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useMotionValueEvent } from 'framer-motion';
import * as THREE from 'three';

export default function JourneyScene({ progress }) {
    const groupRef = useRef();
    const progressRef = useRef(0);

    // Sync motion value to local ref for three.js usage
    useMotionValueEvent(progress, "change", (latest) => {
        progressRef.current = latest;
    });

    // Create a grid of points or small geometries
    const count = 40;
    const items = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 15;
            const y = (Math.random() - 0.5) * 15;
            const z = (Math.random() - 0.5) * 10;
            const size = Math.random() * 0.5 + 0.1;
            temp.push({ x, y, z, size, speed: Math.random() * 0.2 + 0.05 });
        }
        return temp;
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const p = progressRef.current;

        // Rotate and shift based on global scroll progress
        if (groupRef.current) {
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, p * Math.PI * 0.5, 0.02);
            groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
            groupRef.current.position.y = Math.cos(time * 0.1) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#C5A358" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />

            {items.map((item, i) => (
                <Float
                    key={i}
                    speed={item.speed * 3}
                    rotationIntensity={1}
                    floatIntensity={1}
                    position={[item.x, item.y, item.z]}
                >
                    <mesh>
                        <octahedronGeometry args={[item.size, 0]} />
                        <SceneMaterial progressRef={progressRef} />
                    </mesh>
                </Float>
            ))}

            <Sphere args={[15, 64, 64]} scale={[-1, 1, 1]}>
                <MeshDistortMaterial
                    color="#000000"
                    attach="material"
                    distort={0.3}
                    speed={1.5}
                    roughness={0.1}
                    metalness={0.9}
                />
            </Sphere>
        </group>
    );
}

function SceneMaterial({ progressRef }) {
    const materialRef = useRef();

    useFrame(() => {
        if (!materialRef.current) return;
        const p = progressRef.current;
        const color = new THREE.Color();

        if (p < 0.25) color.set('#333333');
        else if (p < 0.5) color.set('#C5A358');
        else if (p < 0.75) color.set('#ffffff');
        else color.set('#1a1a1a');

        materialRef.current.color.lerp(color, 0.05);
        materialRef.current.wireframe = p > 0.4 && p < 0.6;
    });

    return (
        <meshStandardMaterial
            ref={materialRef}
            transparent
            opacity={0.6}
        />
    );
}

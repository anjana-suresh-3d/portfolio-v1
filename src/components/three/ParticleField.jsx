'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleField({ count = 200, mousePosition = { x: 0, y: 0 } }) {
    const meshRef = useRef();
    const initialPositions = useRef();

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = Math.random() * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            sizes[i] = Math.random() * 0.03 + 0.01;
        }

        initialPositions.current = new Float32Array(positions);
        return { positions, sizes };
    }, [count]);

    useFrame((state) => {
        if (!meshRef.current || !initialPositions.current) return;
        const time = state.clock.elapsedTime * 0.1;
        const posArray = meshRef.current.geometry.attributes.position.array;

        // Target offsets based on mouse
        const offsetX = mousePosition.x * 2.0;
        const offsetY = mousePosition.y * 2.0;

        for (let i = 0; i < count; i++) {
            // Base floating animation
            const floatY = Math.sin(time + i * 0.1) * 0.5;

            // Lerp towards initial + parallax offset
            posArray[i * 3] = THREE.MathUtils.lerp(posArray[i * 3], initialPositions.current[i * 3] + offsetX * (i % 2 === 0 ? 1 : 0.5), 0.02);
            posArray[i * 3 + 1] = THREE.MathUtils.lerp(posArray[i * 3 + 1], initialPositions.current[i * 3 + 1] + floatY + offsetY * 0.5, 0.02);
            // Z stays mostly the same
        }

        meshRef.current.geometry.attributes.position.needsUpdate = true;
        meshRef.current.rotation.y = time * 0.05;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={particles.positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                color="#C8A27A"
                transparent
                opacity={0.8}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

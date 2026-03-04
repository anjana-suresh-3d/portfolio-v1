'use client';

import { useRef, useState, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Bvh, AdaptiveEvents } from '@react-three/drei';
import * as THREE from 'three';
import { Model as RoomModel } from './RoomModel';

// Luxurious Warm Architectural Palette
const colors = {
    coveLight: '#ffcc88', // Warm LED 3000K
};

// Drastically simplified particles context
function FloatingWarmDust() {
    const meshRef = useRef();

    const [positions] = useState(() => {
        const count = 15;
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 20;
            pos[i * 3 + 1] = Math.random() * 4 + 1; // Range [1, 5]
            pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        return pos;
    });

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={15} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.1} color={colors.coveLight} transparent opacity={0.4} depthWrite={false} />
        </points>
    );
}

export default function HeroScene() {
    const groupRef = useRef();

    // We will track scroll position directly in useFrame for smooth 60fps updates
    // Use smoothed/damped variables to make camera movement buttery smooth
    const currentCamPos = useRef(new THREE.Vector3(7.0, -2.5, 10.0));
    const targetCamPos = useRef(new THREE.Vector3(7.0, -2.5, 10.0));

    useFrame((state, delta) => {
        const mouseX = state.pointer.x || 0;
        const mouseY = state.pointer.y || 0;

        const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
        const maxScroll = typeof window !== 'undefined' ? window.innerHeight : 1000;
        const scrollProgress = Math.min(scrollY / maxScroll, 1);

        const scrollCamZ = scrollProgress * -4.5;

        targetCamPos.current.x = 7.0 + (mouseX * -1.0);
        targetCamPos.current.y = -2.5 + (mouseY * 0.4);
        targetCamPos.current.z = 10.0 + scrollCamZ;

        currentCamPos.current.x = THREE.MathUtils.damp(currentCamPos.current.x, targetCamPos.current.x, 8, delta);
        currentCamPos.current.y = THREE.MathUtils.damp(currentCamPos.current.y, targetCamPos.current.y, 8, delta);
        currentCamPos.current.z = THREE.MathUtils.damp(currentCamPos.current.z, targetCamPos.current.z, 8, delta);

        state.camera.position.copy(currentCamPos.current);
        state.camera.lookAt(-4, 0.5, -5);

        if (groupRef.current) {
            groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, mouseX * 0.05, 8, delta);
        }
    });

    return (
        <group>
            <Environment preset="city" />
            <ambientLight intensity={0.4} color="#ffe6cc" />

            <directionalLight
                position={[10, 10, 5]}
                intensity={1.5}
                color="#ffffff"
                castShadow
            />

            <pointLight position={[0, 2, 2]} intensity={1.5} color={colors.coveLight} distance={20} />

            <ContactShadows
                position={[0, -2, 0]}
                opacity={0.4}
                scale={20}
                blur={2.4}
                far={4.5}
                resolution={512}
                color="#000000"
            />

            <FloatingWarmDust />

            <AdaptiveEvents />
            <group ref={groupRef} position={[0, 0, 0]}>
                {/* Main Ceiling - Pure White */}
                <mesh position={[0, 6, -5]}>
                    <boxGeometry args={[40, 0.1, 40]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.1} />
                </mesh>

                {/* Cove / Fall Lighting Effect - Offset to prevent Z-fighting */}
                <mesh position={[0, 5.95, -5]}>
                    <boxGeometry args={[36, 0.05, 36]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive="#ffcc88"
                        emissiveIntensity={1.2}
                        transparent
                        opacity={0.6}
                    />
                </mesh>

                {/* Refined warm point lights for subtle 'fall' light */}
                <pointLight position={[8, 5.5, -5]} intensity={0.8} color="#ffcc88" distance={12} />
                <pointLight position={[-8, 5.5, -5]} intensity={0.8} color="#ffcc88" distance={12} />

                <Suspense fallback={null}>
                    <Bvh firstHitOnlyBuffer>
                        <RoomModel />
                    </Bvh>
                </Suspense>
            </group>
        </group>
    );
}

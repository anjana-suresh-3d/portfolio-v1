'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import Lighting from './Lighting';
import ParticleField from './ParticleField';
import FloatingElements from './FloatingElements';

function Floor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <MeshReflectorMaterial
                blur={[300, 100]}
                resolution={1024}
                mixBlur={0.8}
                mixStrength={0.5}
                roughness={0.9}
                depthScale={0.5}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.2}
                color="#F8F6F3"
                metalness={0.1}
            />
        </mesh>
    );
}

function Pillar({ position, height = 4, radius = 0.3 }) {
    return (
        <mesh position={position} castShadow receiveShadow>
            <cylinderGeometry args={[radius, radius, height, 32]} />
            <meshStandardMaterial color="#EDE7E0" roughness={0.7} metalness={0.1} />
        </mesh>
    );
}

function Arch({ position, rotation = [0, 0, 0] }) {
    return (
        <group position={position} rotation={rotation}>
            {/* Left Pillar */}
            <mesh position={[-1.5, 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.5, 4, 0.5]} />
                <meshStandardMaterial color="#D8CEC4" roughness={0.8} />
            </mesh>
            {/* Right Pillar */}
            <mesh position={[1.5, 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.5, 4, 0.5]} />
                <meshStandardMaterial color="#D8CEC4" roughness={0.8} />
            </mesh>
            {/* Top Arch */}
            <mesh position={[0, 4.25, 0]} castShadow receiveShadow>
                <boxGeometry args={[3.5, 0.5, 0.5]} />
                <meshStandardMaterial color="#D8CEC4" roughness={0.8} />
            </mesh>
        </group>
    );
}

function Steps({ position, rotation = [0, 0, 0] }) {
    return (
        <group position={position} rotation={rotation}>
            <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
                <boxGeometry args={[4, 0.3, 1]} />
                <meshStandardMaterial color="#EDE7E0" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.45, -0.8]} castShadow receiveShadow>
                <boxGeometry args={[4, 0.3, 1]} />
                <meshStandardMaterial color="#D8CEC4" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.75, -1.6]} castShadow receiveShadow>
                <boxGeometry args={[4, 0.3, 1]} />
                <meshStandardMaterial color="#C8A27A" roughness={0.4} metalness={0.3} />
            </mesh>
        </group>
    );
}

function Pedestal({ position, height = 1.5 }) {
    const objectRef = useRef();

    useFrame((state) => {
        if (!objectRef.current) return;
        // Rotating the object
        objectRef.current.rotation.y += 0.01;
        objectRef.current.rotation.x += 0.005;
        // Subtle floating effect
        objectRef.current.position.y = height + 0.3 + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.05;
    });

    return (
        <group position={position}>
            <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.4, 0.5, height, 32]} />
                <meshStandardMaterial color="#2B2A28" roughness={0.9} />
            </mesh>
            {/* Display Object on Pedestal */}
            <mesh ref={objectRef} position={[0, height + 0.3, 0]} castShadow>
                <icosahedronGeometry args={[0.3]} />
                <meshPhysicalMaterial color="#C46A4A" roughness={0.2} metalness={0.6} clearcoat={1} envMapIntensity={2} />
            </mesh>
        </group>
    );
}

function Plant({ position }) {
    return (
        <group position={position}>
            {/* Pot */}
            <mesh position={[0, 0.15, 0]} castShadow>
                <cylinderGeometry args={[0.12, 0.1, 0.3, 12]} />
                <meshStandardMaterial color="#D8CEC4" roughness={0.9} />
            </mesh>
            {/* Leaves */}
            <mesh position={[0, 0.45, 0]}>
                <sphereGeometry args={[0.2, 12, 12]} />
                <meshStandardMaterial color="#8A9A8C" roughness={0.6} />
            </mesh>
            <mesh position={[0.08, 0.55, 0.05]}>
                <sphereGeometry args={[0.12, 10, 10]} />
                <meshStandardMaterial color="#708271" roughness={0.6} />
            </mesh>
        </group>
    );
}

export default function HeroScene({ mousePosition = { x: 0, y: 0 } }) {
    const groupRef = useRef();

    useFrame((state) => {
        if (!groupRef.current) return;
        const targetX = mousePosition.x * 0.15;
        const targetY = mousePosition.y * 0.05;

        groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            targetX,
            0.02
        );
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            targetY,
            0.02
        );
    });

    return (
        <>
            <Lighting />
            <ParticleField count={150} mousePosition={mousePosition} />
            <FloatingElements mousePosition={mousePosition} />

            <group ref={groupRef} position={[0, -1, 0]}>
                {/* Vast reflective floor */}
                <Floor />

                {/* Abstract Architectural Composition */}

                {/* Center-Left Structure */}
                <Arch position={[-2.5, 0, -3]} rotation={[0, Math.PI / 6, 0]} />

                {/* Center-Right Structure (Balancing the scene) */}
                <Steps position={[3.5, 0, -2]} rotation={[0, -Math.PI / 4, 0]} />

                {/* Deep Background Pillars */}
                <Pillar position={[-5, 2, -6]} height={6} radius={0.4} />
                <Pillar position={[6, 3, -7]} height={8} radius={0.5} />
                <Pillar position={[1, 1.5, -5]} height={3} radius={0.2} />

                {/* Foreground Focus Objects */}
                <Pedestal position={[-3.5, 0, 1.5]} height={1.2} />
                <Pedestal position={[4, 0, 0.5]} height={1.8} />

                {/* Scattered minimal plants for organic touch */}
                <Plant position={[-1, 0, -1.5]} />
                <Plant position={[5.5, 0, -1]} />
                <Plant position={[-5, 0, 0]} />
            </group>
        </>
    );
}

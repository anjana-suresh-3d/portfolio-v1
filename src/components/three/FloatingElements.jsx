'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function ParallaxElement({ position, scale = 1, speed = 1, parallaxFactor = 1, mousePosition = { x: 0, y: 0 }, children }) {
    const ref = useRef();
    const initialPos = useRef(new THREE.Vector3(...position));

    useFrame((state) => {
        if (!ref.current) return;
        ref.current.rotation.x = state.clock.elapsedTime * 0.3 * speed;
        ref.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;

        // Parallax effect based on mouse
        const targetX = initialPos.current.x + mousePosition.x * parallaxFactor;
        const targetY = initialPos.current.y + mousePosition.y * parallaxFactor;

        ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetX, 0.05);
        ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, 0.05);
    });

    return (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
            <group ref={ref} position={position} scale={scale}>
                {children}
            </group>
        </Float>
    );
}

export default function FloatingElements({ mousePosition = { x: 0, y: 0 } }) {
    return (
        <group>
            {/* Terracotta Torus */}
            <ParallaxElement position={[-4, 3, -2]} scale={0.8} speed={0.7} parallaxFactor={1.5} mousePosition={mousePosition}>
                <torusGeometry args={[0.5, 0.15, 16, 32]} />
                <meshPhysicalMaterial color="#C46A4A" roughness={0.2} metalness={0.8} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={2} />
            </ParallaxElement>

            {/* Brushed Gold Ring */}
            <ParallaxElement position={[4.5, 1.5, -3]} scale={0.5} speed={1.2} parallaxFactor={-1.2} mousePosition={mousePosition}>
                <torusGeometry args={[0.4, 0.02, 16, 32]} />
                <meshPhysicalMaterial color="#C8A27A" metalness={1} roughness={0.1} envMapIntensity={2.5} />
            </ParallaxElement>

            {/* Glass Sphere */}
            <ParallaxElement position={[3, 4, -1]} scale={0.7} speed={0.4} parallaxFactor={1.8} mousePosition={mousePosition}>
                <sphereGeometry args={[0.4, 32, 32]} />
                <meshPhysicalMaterial color="#ffffff" transmission={0.95} opacity={1} metalness={0} roughness={0} ior={1.52} thickness={0.5} specularIntensity={1} envMapIntensity={2} />
            </ParallaxElement>

            {/* Charcoal Cube */}
            <ParallaxElement position={[-2, 5, -3]} scale={0.6} speed={0.4} parallaxFactor={-1.5} mousePosition={mousePosition}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshPhysicalMaterial color="#2B2A28" roughness={0.4} metalness={0.6} clearcoat={0.5} envMapIntensity={1.5} />
            </ParallaxElement>

            {/* Desaturated Sage Dodecahedron */}
            <ParallaxElement position={[5, 3.5, -2]} scale={0.4} speed={0.8} parallaxFactor={1} mousePosition={mousePosition}>
                <dodecahedronGeometry args={[0.6]} />
                <meshStandardMaterial color="#8A9A8C" roughness={0.8} metalness={0.1} />
            </ParallaxElement>

            {/* Wireframe Gold Dodecahedron */}
            <ParallaxElement position={[0, 5, -5]} scale={0.6} speed={0.3} parallaxFactor={-2} mousePosition={mousePosition}>
                <dodecahedronGeometry args={[0.8]} />
                <meshStandardMaterial color="#C8A27A" wireframe transparent opacity={0.5} />
            </ParallaxElement>

            {/* Soft Off-White Icosahedron */}
            <ParallaxElement position={[-5, 2.5, -1]} scale={0.3} speed={0.9} parallaxFactor={1.2} mousePosition={mousePosition}>
                <icosahedronGeometry args={[0.5]} />
                <meshPhysicalMaterial color="#F8F6F3" roughness={0.2} metalness={0.3} clearcoat={0.8} envMapIntensity={1.5} />
            </ParallaxElement>
        </group>
    );
}

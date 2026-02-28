'use client';

import { Environment, ContactShadows, Lightformer } from '@react-three/drei';

export default function Lighting() {
    return (
        <>
            <ambientLight intensity={0.6} color="#ffffff" />

            <directionalLight
                position={[5, 8, 5]}
                intensity={1.5}
                color="#ffffff"
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={20}
                shadow-camera-left={-5}
                shadow-camera-right={5}
                shadow-camera-top={5}
                shadow-camera-bottom={-5}
            />

            <spotLight
                position={[-3, 6, 2]}
                intensity={0.8}
                angle={0.5}
                penumbra={0.8}
                color="#C8A27A"
                castShadow={false}
            />

            <pointLight position={[0, 3, -2]} intensity={0.5} color="#FFF9E6" />

            {/* High intensity environment for glossy reflections */}
            <Environment preset="city" environmentIntensity={1.2} />

            <ContactShadows
                position={[0, -0.01, 0]}
                opacity={0.6}
                scale={15}
                blur={2}
                far={4}
                color="#1F1F1F"
            />
        </>
    );
}

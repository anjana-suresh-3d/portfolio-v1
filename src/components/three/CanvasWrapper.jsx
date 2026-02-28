'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import styles from './CanvasWrapper.module.css';

export default function CanvasWrapper({ children, className = '', style = {} }) {
    const [degraded, setDegraded] = useState(false);

    return (
        <div className={`${styles.canvasContainer} ${className}`} style={style}>
            <Canvas
                gl={{
                    antialias: !degraded,
                    alpha: true,
                    powerPreference: 'high-performance',
                    stencil: false,
                    depth: true,
                }}
                dpr={[1, degraded ? 1.5 : 2]}
                camera={{ position: [0, 2, 8], fov: 45, near: 0.1, far: 100 }}
                style={{ background: 'transparent' }}
            >
                <PerformanceMonitor
                    onDecline={() => setDegraded(true)}
                    onIncline={() => setDegraded(false)}
                />
                <AdaptiveDpr pixelated />
                <Suspense fallback={null}>
                    {children}
                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
}

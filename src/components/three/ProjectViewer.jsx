'use client';

import dynamic from 'next/dynamic';
import { useRef, Suspense } from 'react';
import { OrbitControls, Stage, useGLTF, Html } from '@react-three/drei';
import styles from './ProjectViewer.module.css';

const Canvas = dynamic(() => import('@react-three/fiber').then(mod => ({ default: mod.Canvas })), { ssr: false });

function Model({ url }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}

function LoadingFallback() {
    return (
        <Html center>
            <div className={styles.loader}>
                <div className={styles.spinner} />
                <span>Loading 3D Model...</span>
            </div>
        </Html>
    );
}

export default function ProjectViewer({ modelUrl }) {
    if (!modelUrl) return null;

    return (
        <div className={styles.viewerContainer}>
            <div className={styles.viewer}>
                <Canvas
                    camera={{ position: [0, 2, 5], fov: 50 }}
                    gl={{ antialias: true, alpha: true }}
                    dpr={[1, 2]}
                >
                    <Suspense fallback={<LoadingFallback />}>
                        <Stage
                            environment="apartment"
                            intensity={0.6}
                            adjustCamera={1.2}
                        >
                            <Model url={modelUrl} />
                        </Stage>
                    </Suspense>
                    <OrbitControls
                        makeDefault
                        autoRotate
                        autoRotateSpeed={0.5}
                        enablePan
                        enableZoom
                        minDistance={1}
                        maxDistance={15}
                    />
                </Canvas>
            </div>
            <div className={styles.controls}>
                <span className={styles.hint}>Drag to rotate · Scroll to zoom · Right-click to pan</span>
            </div>
        </div>
    );
}

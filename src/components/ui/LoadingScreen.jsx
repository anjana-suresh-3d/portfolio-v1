'use client';

import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import { useIsLoading } from '@/hooks/useContent';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
    const isContentLoading = useIsLoading();
    const { active, progress, total } = useProgress();
    const [hidden, setHidden] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [minTimePassed, setMinTimePassed] = useState(false);

    useEffect(() => {
        setMounted(true);
        const minTimer = setTimeout(() => {
            setMinTimePassed(true);
        }, 2000);
        return () => clearTimeout(minTimer);
    }, []);

    // Loader is active if content API is still loading
    // OR if 3D scene is still loading (progress < 100 and we have models)
    // Sometimes 3D takes a moment to become active, so we have a small safe timeout.
    const is3dLoading = active || (total > 0 && progress < 100);
    const isLoading = isContentLoading || is3dLoading;
    const is3dReady = total === 0 ? true : progress === 100;

    useEffect(() => {
        if (!isLoading && mounted && is3dReady && minTimePassed) {
            const timer = setTimeout(() => {
                setHidden(true);
            }, 800); // Allow for a slight overlap for premium feel
            return () => clearTimeout(timer);
        }
    }, [isLoading, mounted, is3dReady, minTimePassed]);

    if (hidden) return null;

    return (
        <div className={`${styles.overlay} ${(!isLoading && is3dReady && minTimePassed) ? styles.fade : ''}`}>
            <div className={styles.content}>
                <div className={styles.nameLoader}>
                    Anjana Suresh
                </div>
                <div className={styles.progressText}>
                    {minTimePassed ? (Math.round(progress) || 0) : Math.min(Math.round(progress) || 0, 99)}%
                </div>
            </div>
        </div>
    );
}

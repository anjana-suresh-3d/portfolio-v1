'use client';

import { useEffect, useState } from 'react';
import { useContentValue, useIsLoading } from '@/hooks/useContent';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
    const isLoading = useIsLoading();
    const [hidden, setHidden] = useState(false);
    const loaderUrl = useContentValue('site.loader');

    useEffect(() => {
        if (!isLoading) {
            const timer = setTimeout(() => {
                setHidden(true);
            }, 800); // Allow for a slight overlap for premium feel
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    if (hidden) return null;

    return (
        <div className={`${styles.overlay} ${!isLoading ? styles.fade : ''}`}>
            <div className={styles.content}>
                {loaderUrl ? (
                    <img src={loaderUrl} alt="Loading..." className={styles.loaderImg} />
                ) : (
                    <div className={styles.defaultLoader}>
                        <div className={styles.bar}></div>
                    </div>
                )}
                <p className={styles.text}>Initializing Space...</p>
            </div>
        </div>
    );
}

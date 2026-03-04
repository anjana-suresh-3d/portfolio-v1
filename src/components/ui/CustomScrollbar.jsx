'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CustomScrollbar() {
    const [mounted, setMounted] = useState(false);
    const { scrollYProgress } = useScroll();

    // Smooth out the scroll progress for a premium feel
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '6px',
            height: '100vh',
            background: 'transparent',
            zIndex: 9999, // Extremely high z-index to stay on top
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'center',
            paddingRight: '2px' // slight offset from absolute edge
        }}>
            <motion.div
                style={{
                    width: '2px', // Very thin elegant line
                    height: '100%',
                    background: 'var(--text-primary)', // bright white
                    transformOrigin: 'top',
                    scaleY,
                    opacity: 0.5,
                    borderRadius: '10px'
                }}
            />
        </div>
    );
}

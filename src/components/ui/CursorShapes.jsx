'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import styles from './CursorShapes.module.css';

const SHAPE_TYPES = ['square', 'circle', 'triangle'];
const MAX_PARTICLES = 1;

export default function CursorShapes() {
    const [particles, setParticles] = useState([]);

    const addParticle = useCallback((x, y) => {
        const id = Math.random().toString(36).substring(2, 9);
        const type = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
        const size = Math.random() * 15 + 8; // Slightly smaller
        const rotation = Math.random() * 360;

        setParticles((prev) => {
            const next = [...prev, { id, x, y, type, size, rotation }];
            if (next.length > MAX_PARTICLES) return next.slice(1);
            return next;
        });

        // Auto-remove after animation
        setTimeout(() => {
            setParticles((prev) => prev.filter((p) => p.id !== id));
        }, 800); // Shorter duration
    }, []);

    useEffect(() => {
        let lastPos = { x: 0, y: 0 };
        const threshold = 30; // Increased threshold for less density

        const handleMouseMove = (e) => {
            const dist = Math.sqrt(
                Math.pow(e.clientX - lastPos.x, 2) + Math.pow(e.clientY - lastPos.y, 2)
            );

            if (dist > threshold) {
                addParticle(e.clientX, e.clientY);
                lastPos = { x: e.clientX, y: e.clientY };
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [addParticle]);

    return (
        <div className={styles.container}>
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{
                            x: p.x - p.size / 2,
                            y: p.y - p.size / 2,
                            opacity: 0.4,
                            scale: 0.5,
                            rotate: p.rotation
                        }}
                        animate={{
                            opacity: 0,
                            scale: 1.5,
                            y: p.y - p.size / 2 - 20, // Slight upward drift
                            rotate: p.rotation + 45
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`${styles.shape} ${styles[p.type]}`}
                        style={{
                            width: p.size,
                            height: p.size,
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

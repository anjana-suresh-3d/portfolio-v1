'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useContent } from '@/hooks/useContent';
import styles from './HeroSection.module.css';
import MagneticButton from '@/components/ui/MagneticButton';
import Link from 'next/link';

const CanvasWrapper = dynamic(() => import('@/components/three/CanvasWrapper'), { ssr: false });
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

const ease = [0.76, 0, 0.24, 1];

export default function HeroSection() {
    const { position, handleMouseMove } = useMousePosition();
    const c = useContent();
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
    const opacityText = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    return (
        <section ref={containerRef} className={styles.hero} onMouseMove={handleMouseMove} id="hero">
            {/* 3D Canvas Layer */}
            <div className={styles.canvasLayer}>
                <CanvasWrapper>
                    <HeroScene mousePosition={position} />
                </CanvasWrapper>
            </div>

            {/* Subtle gradient overlay for text readability */}
            <div className={styles.overlay} />

            {/* Content Layer */}
            <motion.div style={{ y: yText, opacity: opacityText }} className={styles.contentLayer}>
                <div className={styles.bottomContent}>
                    {/* Large Title */}
                    <motion.div
                        className={styles.titleBlock}
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.3, ease }}
                    >
                        <h1 className={styles.title}>
                            {c['hero.title'] || 'Designing'}
                            <br />
                            <span className={styles.titleLight}>
                                {c['hero.titleAccent'] || 'Spaces That'}
                            </span>
                            <br />
                            <span className={styles.titleAccent}>
                                {c['hero.titleAccent2'] || 'Inspire'}
                            </span>
                        </h1>
                    </motion.div>

                    {/* Info Card - Glassmorphic */}
                    <motion.div
                        className={styles.infoCard}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6, ease }}
                    >
                        <p className={styles.description}>
                            {c['hero.subtitle'] || 'Crafting bespoke interiors that blend beauty, function, and soul into every space.'}
                        </p>

                        <div className={styles.cardDivider} />

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1, ease }}
                        >
                            <MagneticButton>
                                <Link href="/projects" className={styles.ctaBtn}>
                                    <span>{c['hero.cta'] || 'Explore Projects'}</span>
                                    <ArrowRight size={14} className={styles.ctaIcon} />
                                </Link>
                            </MagneticButton>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className={styles.scrollIndicator}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                >
                    <div className={styles.scrollLine} />
                    <span className={styles.scrollText}>Scroll</span>
                </motion.div>
            </motion.div>
        </section>
    );
}

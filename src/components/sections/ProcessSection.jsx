'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useContent } from '@/hooks/useContent';
import styles from './ProcessSection.module.css';

export default function ProcessSection() {
    const containerRef = useRef(null);
    const c = useContent();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const steps = [
        {
            number: '01',
            title: c['process.1.title'] || 'Discovery',
            desc: c['process.1.desc'] || 'We begin by understanding your lifestyle, aspirations, and the unique challenges of your space.'
        },
        {
            number: '02',
            title: c['process.2.title'] || 'Concept',
            desc: c['process.2.desc'] || 'Developing a cohesive design language through moodboards and materiality.'
        },
        {
            number: '03',
            title: c['process.3.title'] || 'Design & Planning',
            desc: c['process.3.desc'] || 'Technical drawings and spatial planning to ensure every inch is optimized for function and form.'
        },
        {
            number: '04',
            title: c['process.4.title'] || 'Visualization',
            desc: c['process.4.desc'] || 'Photorealistic renders that allow you to step into your space before a single brick is laid.'
        },
        {
            number: '05',
            title: c['process.5.title'] || 'Curation',
            desc: c['process.5.desc'] || 'Sourcing the finest furniture, bespoke joinery, and artisanal decor from around the world.'
        },
        {
            number: '06',
            title: c['process.6.title'] || 'The Reveal',
            desc: c['process.6.desc'] || 'The final handover where every detail is in place, and your vision becomes a living reality.'
        }
    ];

    return (
        <section ref={containerRef} className={styles.section} id="journey">
            <div className={styles.stickyWrapper}>
                {/* Content Overlay */}
                <div className={styles.contentRow}>
                    <div className={styles.labelRow}>
                        <div className={styles.line} />
                        <span className={styles.label}>{c['process.label'] || 'The Design Journey'}</span>
                        <div className={styles.line} />
                    </div>

                    <div className={styles.stepContainer}>
                        {steps.map((step, idx) => (
                            <Step
                                key={idx}
                                step={step}
                                index={idx}
                                total={steps.length}
                                progress={scrollYProgress}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Step({ step, index, total, progress }) {
    const start = index / total;
    const end = (index + 0.9) / total;

    // Timing: Number comes first, then content
    const numStart = start;
    const contentStart = start + (0.3 / total); // Clear "number first" effect

    const opacity = useTransform(progress, [contentStart, contentStart + 0.1, end - 0.1, end], [0, 1, 1, 0]);
    const y = useTransform(progress, [contentStart, contentStart + 0.1, end - 0.1, end], [60, 0, 0, -60]);

    const numOpacity = useTransform(progress, [numStart, numStart + 0.05, end - 0.05, end], [0, 0.03, 0.03, 0]);
    const numY = useTransform(progress, [numStart, end], [100, -100]); // Parallax movement

    return (
        <motion.div
            style={{ opacity, y }}
            className={styles.stepItem}
        >
            <motion.div
                className={styles.stepNumber}
                style={{
                    opacity: numOpacity,
                    y: numY,
                    scale: useTransform(progress, [numStart, end], [0.95, 1.05])
                }}
            >
                {step.number}
            </motion.div>

            <div className={styles.stepContent}>
                <motion.h3
                    className={styles.stepTitle}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 1.2,
                        ease: [0.16, 1, 0.3, 1]
                    }}
                >
                    {step.title}
                </motion.h3>

                <motion.p
                    className={styles.stepDesc}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{
                        delay: 0.4,
                        duration: 1
                    }}
                >
                    {step.desc}
                </motion.p>
            </div>
        </motion.div>
    );
}

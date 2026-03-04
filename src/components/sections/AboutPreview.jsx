'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion';
import { useContent } from '@/hooks/useContent';
import styles from './AboutPreview.module.css';

const Word = ({ children, progress, range }) => {
    const opacity = useTransform(progress, range, [0.35, 1]);
    return (
        <motion.span style={{ opacity, display: 'inline-block', marginRight: '4px' }}>
            {children}
        </motion.span>
    );
};

const AnimatedCounter = ({ value }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [displayValue, setDisplayValue] = useState("0");

    useEffect(() => {
        if (!isInView || !value) return;

        const match = String(value).match(/(\d+)(.*)/);
        if (!match) {
            setDisplayValue(value);
            return;
        }

        const num = parseInt(match[1], 10);
        const suffix = match[2] || '';

        setDisplayValue("0" + suffix);

        const controls = animate(0, num, {
            duration: 2.5,
            ease: [0.16, 1, 0.3, 1], // Cinematic ease-out
            onUpdate: (latest) => {
                setDisplayValue(Math.round(latest) + suffix);
            }
        });

        return controls.stop;
    }, [isInView, value]);

    return <span ref={ref}>{displayValue}</span>;
};

export default function AboutPreview() {
    const sectionRef = useRef(null);
    const c = useContent();

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start 80%", "end 50%"]
    });

    const quoteText = c['about.quote'] || "Design is not just what it looks like. Design is how it works and feels. We create spaces that breathe life into your daily rituals.";
    const words = quoteText.split(" ");

    return (
        <section className={styles.section} id="vision" ref={sectionRef}>
            <div className={styles.container}>
                <div className={styles.labelRow}>
                    <div className={styles.line} />
                    <span className={styles.label}>{c['about.label'] || 'Vision'}</span>
                </div>

                <div className={styles.content}>
                    <div className={styles.left}>
                        <h2 className={styles.heading}>
                            {c['about.heading'] || 'Where Creativity Meets Purpose'}
                        </h2>

                        <div className={styles.stats}>
                            <motion.div className={styles.stat} whileHover={{ scale: 1.05, y: -5 }} transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}>
                                <span className={styles.statNumber}><AnimatedCounter value={c['about.stat1.number'] || '5+'} /></span>
                                <span className={styles.statLabel}>{c['about.stat1.label'] || 'Years Experience'}</span>
                            </motion.div>
                            <motion.div className={styles.stat} whileHover={{ scale: 1.05, y: -5 }} transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}>
                                <span className={styles.statNumber}><AnimatedCounter value={c['about.stat2.number'] || '40+'} /></span>
                                <span className={styles.statLabel}>{c['about.stat2.label'] || 'Projects Completed'}</span>
                            </motion.div>
                            <motion.div className={styles.stat} whileHover={{ scale: 1.05, y: -5 }} transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}>
                                <span className={styles.statNumber}><AnimatedCounter value={c['about.stat3.number'] || '100%'} /></span>
                                <span className={styles.statLabel}>{c['about.stat3.label'] || 'Client Satisfaction'}</span>
                            </motion.div>
                        </div>
                    </div>

                    <div className={styles.right}>
                        <p className={styles.quote}>
                            {words.map((word, i) => {
                                const start = i / words.length;
                                const end = start + (1 / words.length);
                                return (
                                    <Word key={i} progress={scrollYProgress} range={[start, end]}>
                                        {word}
                                    </Word>
                                );
                            })}
                        </p>

                        <p className={styles.text}>
                            {c['about.description'] || ''}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

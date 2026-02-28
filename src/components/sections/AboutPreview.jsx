'use client';

import { useEffect, useRef } from 'react';
import { useContent } from '@/hooks/useContent';
import styles from './AboutPreview.module.css';

export default function AboutPreview() {
    const sectionRef = useRef(null);
    const c = useContent();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add(styles.visible); }); },
            { threshold: 0.2 }
        );
        const elements = sectionRef.current?.querySelectorAll(`.${styles.animate}`);
        elements?.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <section className={styles.section} id="about-preview" ref={sectionRef}>
            <div className={styles.container}>
                <div className={styles.labelRow}>
                    <div className={styles.line} />
                    <span className={`${styles.label} ${styles.animate}`}>{c['about.label'] || 'About'}</span>
                </div>
                <div className={styles.grid}>
                    <div className={styles.left}>
                        <h2 className={`${styles.heading} ${styles.animate}`}>
                            {c['about.heading'] || 'Where Creativity Meets Purpose'}
                        </h2>
                        <p className={`${styles.quote} ${styles.animate}`}>{c['about.quote'] || ''}</p>
                    </div>
                    <div className={styles.right}>
                        <p className={`${styles.text} ${styles.animate}`}>
                            {c['about.description'] || ''}
                        </p>
                        <div className={`${styles.stats} ${styles.animate}`}>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>{c['about.stat1.number'] || '5+'}</span>
                                <span className={styles.statLabel}>{c['about.stat1.label'] || 'Years Experience'}</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>{c['about.stat2.number'] || '40+'}</span>
                                <span className={styles.statLabel}>{c['about.stat2.label'] || 'Projects Completed'}</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNumber}>{c['about.stat3.number'] || '100%'}</span>
                                <span className={styles.statLabel}>{c['about.stat3.label'] || 'Client Satisfaction'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

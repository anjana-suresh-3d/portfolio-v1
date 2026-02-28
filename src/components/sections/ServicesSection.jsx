'use client';

import { useEffect, useRef } from 'react';
import { Home, Building2, Layout, Box } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import styles from './ServicesSection.module.css';

const icons = [Home, Building2, Layout, Box];

export default function ServicesSection() {
    const sectionRef = useRef(null);
    const c = useContent();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add(styles.visible); }); },
            { threshold: 0.15 }
        );
        const elements = sectionRef.current?.querySelectorAll(`.${styles.animate}`);
        elements?.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const services = [1, 2, 3, 4].map((i) => ({
        title: c[`services.${i}.title`] || `Service ${i}`,
        desc: c[`services.${i}.desc`] || '',
        Icon: icons[i - 1],
    }));

    return (
        <section className={styles.section} id="services" ref={sectionRef}>
            <div className={styles.container}>
                <div className={styles.labelRow}>
                    <div className={styles.line} />
                    <span className={`${styles.label} ${styles.animate}`}>{c['services.label'] || 'Services'}</span>
                </div>
                <h2 className={`${styles.heading} ${styles.animate}`}>{c['services.heading'] || 'What I Offer'}</h2>
                <div className={styles.grid}>
                    {services.map((service, idx) => (
                        <div key={idx} className={`${styles.card} ${styles.animate}`} style={{ transitionDelay: `${idx * 0.1}s` }}>
                            <div className={styles.iconWrapper}><service.Icon size={24} strokeWidth={1.5} /></div>
                            <h3 className={styles.cardTitle}>{service.title}</h3>
                            <p className={styles.cardDesc}>{service.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

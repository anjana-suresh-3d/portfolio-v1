'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import styles from './ContactCTA.module.css';

export default function ContactCTA() {
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
        <section className={styles.section} id="contact-cta" ref={sectionRef}>
            <div className={styles.container}>
                <p className={`${styles.label} ${styles.animate}`}>{c['contact.label'] || 'Get In Touch'}</p>
                <h2 className={`${styles.heading} ${styles.animate}`}>
                    {c['contact.heading'] || "Let's bring your vision to life."}
                </h2>
                <Link href="/contact" className={`${styles.cta} ${styles.animate}`}>
                    {c['contact.cta'] || "Let's Work Together"} <ArrowRight size={18} />
                </Link>
            </div>
        </section>
    );
}

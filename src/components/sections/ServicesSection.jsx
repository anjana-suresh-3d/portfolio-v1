'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Home, Building2, Layout, Box } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import styles from './ServicesSection.module.css';

const icons = [Home, Building2, Layout, Box];

export default function ServicesSection() {
    const c = useContent();
    const targetRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    // Translate the carousel container to the left based on scroll progress
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

    const services = [1, 2, 3, 4].map((i) => ({
        title: c[`services.${i}.title`] || `Service ${i}`,
        desc: c[`services.${i}.desc`] || '',
        Icon: icons[i - 1],
    }));

    return (
        <section ref={targetRef} className={styles.carouselSection} id="services">
            <div className={styles.stickyContainer}>

                <div className={styles.header}>
                    <div className={styles.labelRow}>
                        <div className={styles.line} />
                        <span className={styles.label}>{c['services.label'] || 'Services'}</span>
                    </div>
                    <h2 className={styles.heading}>
                        {c['services.heading'] || 'What I Offer'}
                    </h2>
                </div>

                <div className={styles.scrollWindow}>
                    <motion.div style={{ x }} className={styles.carouselContainer}>
                        {services.map((service, idx) => (
                            <ServiceCard key={idx} service={service} index={idx} />
                        ))}
                    </motion.div>
                </div>

            </div>
        </section>
    );
}

function ServiceCard({ service, index }) {
    return (
        <div className={styles.card}>
            <div className={styles.iconWrapper}>
                <service.Icon size={32} strokeWidth={1.25} />
            </div>
            <h3 className={styles.cardTitle}>{service.title}</h3>
            <p className={styles.cardDesc}>{service.desc}</p>
        </div>
    );
}

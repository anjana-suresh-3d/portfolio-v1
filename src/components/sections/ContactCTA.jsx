'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useContent } from '@/hooks/useContent';
import styles from './ContactCTA.module.css';
import MagneticButton from '@/components/ui/MagneticButton';

export default function ContactCTA() {
    const sectionRef = useRef(null);
    const c = useContent();

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end end"]
    });

    const yMove = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);
    const bgScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
    const borderRadius = useTransform(scrollYProgress, [0, 1], ["80px", "0px"]);

    return (
        <section className={styles.section} id="contact" ref={sectionRef}>
            <motion.div
                className={styles.container}
                style={{ scale: bgScale, borderRadius, y: yMove }}
            >
                <div className={styles.content}>
                    <p className={styles.label}>{c['contact.label'] || 'Got a project in mind?'}</p>
                    <h2 className={styles.heading}>
                        {c['contact.heading'] || "Let's craft your space."}
                    </h2>

                    <div className={styles.btnWrapper}>
                        <MagneticButton>
                            <Link href="/contact" className={styles.cta}>
                                <span>{c['contact.cta'] || "Get in touch"}</span>
                                <ArrowRight size={18} className={styles.ctaIcon} />
                            </Link>
                        </MagneticButton>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

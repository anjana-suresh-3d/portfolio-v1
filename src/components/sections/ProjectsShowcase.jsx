'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './ProjectsShowcase.module.css';
import MagneticButton from '@/components/ui/MagneticButton';

export default function ProjectsShowcase() {
    const [projects, setProjects] = useState([]);
    const targetRef = useRef(null);

    useEffect(() => {
        fetch('/api/projects?published=true&featured=true')
            .then(res => res.json())
            .then(data => {
                const finalData = data.length > 0 ? data : [];
                if (finalData.length === 0) {
                    fetch('/api/projects?published=true')
                        .then(res => res.json())
                        .then(latest => setProjects(latest.slice(0, 6)));
                } else {
                    setProjects(finalData);
                }
            })
            .catch(console.error);
    }, []);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]); // Adjust translation length as needed based on card count

    return (
        <section ref={targetRef} className={styles.editorialSection} id="work">
            {/* Asymmetric Animated Background Grid */}
            <div className={styles.gridLayer}>
                <motion.div className={styles.vLine} style={{ left: '15%' }} />
                <motion.div className={styles.vLine} style={{ left: '45%' }} />
                <motion.div className={styles.vLine} style={{ right: '20%' }} />
                <motion.div className={styles.hLine} style={{ top: '25%' }} />
                <motion.div className={styles.hLine} style={{ top: '75%' }} />
            </div>

            <div className={styles.stickyWrapper}>
                <div className={styles.header}>
                    <div className={styles.labelRow}>
                        <div className={styles.line} />
                        <span className={styles.label}>Selected Works</span>
                    </div>
                </div>

                {projects.length > 0 ? (
                    <div className={styles.scrollWindow}>
                        <motion.div style={{ x }} className={styles.carouselContainer}>
                            {projects.map((project, idx) => (
                                <EditorialProjectCard
                                    key={project.id}
                                    project={project}
                                    index={idx}
                                />
                            ))}

                            {/* View all trigger as the final card in the carousel */}
                            <div className={styles.viewAllWrapper}>
                                <Link href="/projects" className={styles.viewAllBtn}>
                                    <span>View All Projects</span>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <div style={{ padding: '0 var(--space-xl)' }}>
                        <p style={{ opacity: 0.5 }}>Loading featured works...</p>
                    </div>
                )}
            </div>
        </section>
    );
}

function EditorialProjectCard({ project, index }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Stagger animation based on index
    return (
        <motion.div
            className={styles.cardWrapper}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link href={`/projects/${project.slug}`} className={styles.cardLink}>
                <div className={styles.imageContainer}>
                    <div
                        style={isMobile ? { height: '100%', top: '0%' } : { height: '100%', top: '0%' }}
                        className={styles.parallaxImageLayer}
                    >
                        <Image
                            src={project.coverImage || '/placeholder.jpg'}
                            alt={project.title}
                            fill
                            unoptimized={true}
                            sizes="(max-width: 1024px) 100vw, 45vw"
                            className={styles.image}
                        />
                    </div>

                    {/* Hover Overlay Button */}
                    <div className={styles.hoverOverlay}>
                        <div className={styles.hoverButton}>
                            Go to Project
                        </div>
                    </div>
                </div>

                <div className={styles.cardMeta}>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <div className={styles.metaRow}>
                        <span className={styles.projectCategory}>{project.category}</span>
                        <span className={styles.projectYear}>{project.year || '24'}</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

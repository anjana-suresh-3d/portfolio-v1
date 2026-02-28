'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import InfiniteCarousel from '@/components/ui/InfiniteCarousel';
import styles from './ProjectsShowcase.module.css';

export default function ProjectsShowcase() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch('/api/projects?published=true&featured=true')
            .then(res => res.json())
            .then(data => {
                const formatProjects = (arr) => arr.map(p => ({
                    ...p,
                    url: p.coverImage, // map coverImage to url for carousel
                    description: p.description && p.description.length > 100
                        ? p.description.substring(0, 100) + '...'
                        : p.description
                }));

                if (data.length === 0) {
                    // Fallback to latest published if no featured
                    fetch('/api/projects?published=true')
                        .then(res => res.json())
                        .then(latest => setProjects(formatProjects(latest.slice(0, 6))));
                } else {
                    setProjects(formatProjects(data));
                }
            })
            .catch(console.error);
    }, []);

    const handleProjectClick = (project) => {
        window.location.href = `/projects/${project.slug}`;
    };

    return (
        <section className={styles.section} id="projects-showcase">
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.labelRow}>
                        <div className={styles.line} />
                        <span className={styles.label}>Selected Works</span>
                    </div>
                    <Link href="/projects" className={styles.viewAll}>
                        View All <ArrowUpRight size={16} />
                    </Link>
                </div>
            </div>

            {projects.length > 0 ? (
                <div className={styles.carouselWrapper}>
                    <InfiniteCarousel images={projects} onImageClick={handleProjectClick} />
                </div>
            ) : (
                <div className={styles.container}>
                    <p style={{ opacity: 0.5, marginTop: '2rem' }}>Loading featured complete works...</p>
                </div>
            )}
        </section>
    );
}

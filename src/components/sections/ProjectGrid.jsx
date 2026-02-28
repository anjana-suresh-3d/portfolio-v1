'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import styles from './ProjectGrid.module.css';

const categories = ['All', 'Residential', 'Commercial', 'Hospitality'];

export default function ProjectGrid() {
    const [projects, setProjects] = useState([]);
    const [active, setActive] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/projects?published=true')
            .then((res) => res.json())
            .then((data) => {
                setProjects(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active);

    if (loading) {
        return (
            <div className={styles.loading}>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={styles.skeleton} />
                ))}
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className={styles.empty}>
                <p>No projects published yet. Check back soon!</p>
            </div>
        );
    }

    return (
        <div>
            <div className={styles.filters}>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`${styles.filterBtn} ${active === cat ? styles.active : ''}`}
                        onClick={() => setActive(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className={styles.grid}>
                {filtered.map((project) => (
                    <Link key={project.id} href={`/projects/${project.slug}`} className={styles.card}>
                        <div className={styles.imageWrapper}>
                            {project.coverImage ? (
                                <img
                                    src={project.coverImage.startsWith('http') ? `/_next/image?url=${encodeURIComponent(project.coverImage)}&w=1920&q=75` : project.coverImage}
                                    alt={project.title}
                                    className={styles.image}
                                />
                            ) : (
                                <div className={styles.placeholder}>{project.title.charAt(0)}</div>
                            )}
                            <div className={styles.overlay}>
                                <ArrowUpRight size={28} />
                            </div>
                        </div>
                        <div className={styles.meta}>
                            <h3 className={styles.title}>{project.title}</h3>
                            <span className={styles.category}>{project.category} · {project.year}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

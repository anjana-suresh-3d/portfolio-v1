'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';
import InfiniteCarousel from '@/components/ui/InfiniteCarousel';
import ImageModal from '@/components/ui/ImageModal';
import styles from './detail.module.css';

const ProjectViewer = dynamic(() => import('@/components/three/ProjectViewer'), { ssr: false });

export default function ProjectDetailPage() {
    const params = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageClick = (img) => {
        setSelectedImage(img);
        setIsModalOpen(true);
    };

    useEffect(() => {
        fetch('/api/projects?published=true')
            .then((res) => res.json())
            .then((data) => {
                const found = (Array.isArray(data) ? data : []).find((p) => p.slug === params.slug);
                setProject(found || null);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [params.slug]);

    if (loading) {
        return (
            <>
                <Navbar />
                <main className={styles.page}>
                    <div className={styles.container}>
                        <div className={styles.loadingState}>Loading project...</div>
                    </div>
                </main>
            </>
        );
    }

    if (!project) {
        return (
            <>
                <Navbar />
                <main className={styles.page}>
                    <div className={styles.container}>
                        <div className={styles.notFound}>
                            <h2>Project not found</h2>
                            <Link href="/projects" className={styles.backLink}><ArrowLeft size={16} /> Back to Projects</Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className={styles.page}>
                <div className={styles.container}>
                    <Link href="/projects" className={styles.backLink}>
                        <ArrowLeft size={16} /> Back to Projects
                    </Link>

                    <div className={styles.header}>
                        <h1 className={styles.title}>{project.title}</h1>
                        <div className={styles.meta}>
                            <span className={styles.category}>{project.category}</span>
                            <span className={styles.metaItem}><Calendar size={14} /> {project.year}</span>
                            {project.location && (
                                <span className={styles.metaItem}><MapPin size={14} /> {project.location}</span>
                            )}
                        </div>
                    </div>

                    <div className={styles.coverWrapper}>
                        {project.coverImage ? (
                            <img src={project.coverImage} alt={project.title} className={styles.coverImage} />
                        ) : (
                            <div className={styles.coverPlaceholder}>{project.title.charAt(0)}</div>
                        )}
                    </div>

                    <div className={styles.content}>
                        <div className={styles.description}>
                            <h2>About This Project</h2>
                            <p>{project.description}</p>
                        </div>
                    </div>

                    {project.modelUrl && project.showModel !== false && (
                        <div className={styles.viewerSection}>
                            <h2 className={styles.sectionTitle}>3D Model</h2>
                            <ProjectViewer modelUrl={project.modelUrl} />
                        </div>
                    )}

                    {project.images?.length > 0 && (
                        <div className={styles.gallerySection}>
                            <h2 className={styles.sectionTitle}>Project Gallery</h2>
                            <InfiniteCarousel
                                images={project.images}
                                onImageClick={handleImageClick}
                            />
                        </div>
                    )}
                </div>
            </main>
            <Footer />

            <ImageModal
                isOpen={isModalOpen}
                image={selectedImage}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}

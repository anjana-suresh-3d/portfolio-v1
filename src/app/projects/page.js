import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import ProjectGrid from '@/components/sections/ProjectGrid';
import styles from './projects.module.css';

export const metadata = {
    title: 'Projects — Anjana Suresh',
    description: 'Explore the portfolio of interior design projects by Anjana Suresh.',
};

export default function ProjectsPage() {
    return (
        <>
            <Navbar />
            <main className={styles.page}>
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <div className={styles.labelRow}>
                            <div className={styles.line} />
                            <span className={styles.label}>Portfolio</span>
                        </div>
                        <h1 className={styles.heading}>Selected Works</h1>
                        <p className={styles.subtitle}>Spaces designed to inspire, function, and endure.</p>
                    </div>
                </section>
                <section className={styles.projects}>
                    <div className={styles.container}>
                        <ProjectGrid />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

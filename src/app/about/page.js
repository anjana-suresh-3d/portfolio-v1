'use client';

import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { ContentProvider, useContent } from '@/hooks/useContent';
import styles from './about.module.css';

function AboutContent() {
    const c = useContent();

    // Split tools by | and filter out empty strings
    const tools = (c['aboutPage.tools'] || 'SketchUp & AutoCAD for spatial planning|D5 Render & V-Ray for photorealistic visualization|Material sourcing and vendor coordination|On-site project management')
        .split('|')
        .filter(t => t.trim().length > 0);

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.labelRow}>
                        <div className={styles.line} />
                        <span className={styles.label}>{c['about.label'] || 'About Me'}</span>
                    </div>
                    <h1 className={styles.heading}>
                        {c['aboutPage.heading'] || 'Designing spaces that reflect who you are.'}
                    </h1>
                </div>
            </section>

            <section className={styles.content}>
                <div className={styles.container}>
                    <div className={styles.grid}>
                        <div className={styles.imageCol}>
                            <div className={styles.imagePlaceholder}>
                                <span>AS</span>
                            </div>
                        </div>
                        <div className={styles.textCol}>
                            <h2 className={styles.subheading}>My Story</h2>
                            <p>{c['aboutPage.story'] || "I'm Anjana Suresh, an interior designer based in India."}</p>
                            <p>{c['aboutPage.story2'] || ""}</p>

                            <h2 className={styles.subheading}>Philosophy</h2>
                            <p>{c['aboutPage.philosophy'] || ""}</p>

                            <h2 className={styles.subheading}>What I Work With</h2>
                            <ul className={styles.toolsList}>
                                {tools.map((tool, i) => (
                                    <li key={i}>{tool.trim()}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default function AboutPage() {
    return (
        <ContentProvider>
            <Navbar />
            <AboutContent />
            <Footer />
        </ContentProvider>
    );
}

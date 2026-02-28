'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useContent } from '@/hooks/useContent';
import styles from './HeroSection.module.css';

const CanvasWrapper = dynamic(() => import('@/components/three/CanvasWrapper'), { ssr: false });
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

export default function HeroSection() {
    const { position, handleMouseMove } = useMousePosition();
    const c = useContent();

    return (
        <section className={styles.hero} onMouseMove={handleMouseMove} id="hero">
            <div className={styles.canvasLayer}>
                <CanvasWrapper>
                    <HeroScene mousePosition={position} />
                </CanvasWrapper>
            </div>
            <div className={styles.overlay} />
            <div className={styles.content}>
                <p className={styles.greeting}>{c['hero.label'] || 'Interior Design Studio'}</p>
                <h1 className={styles.name}>
                    {c['hero.title'] || 'Designing Spaces That Tell'}<br />
                    <span className={styles.accent}>{c['hero.titleAccent'] || 'Your Story'}</span>
                </h1>
                <div className={styles.divider} />
                <p className={styles.tagline}>{c['hero.subtitle'] || 'Crafting bespoke interiors that blend beauty, function, and soul.'}</p>
                <Link href="/projects" className={styles.ctaBtn}>{c['hero.cta'] || 'View Projects'}</Link>
            </div>
            <button className={styles.scrollIndicator} onClick={() => document.getElementById('about-preview')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Scroll down">
                <span className={styles.scrollText}>Scroll</span>
                <ChevronDown size={18} className={styles.scrollIcon} />
            </button>
        </section>
    );
}

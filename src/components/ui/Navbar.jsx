'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useContent } from '@/hooks/useContent';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

const nav = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const c = useContent();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} id="main-nav">
            <div className={styles.inner}>
                <Link href="/" className={styles.logo} aria-label="Home">
                    <span className={styles.logoName}>{c['nav.brand'] || 'Anjana Suresh'}</span>
                    <span className={styles.logoTitle}>Interior Designer</span>
                </Link>
                <div className={styles.desktopLinks}>
                    {nav.map((item) => (
                        <Link key={item.href} href={item.href} className={styles.navLink}>{item.label}</Link>
                    ))}
                </div>
                <button className={styles.mobileToggle} onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
            <div className={`${styles.mobileOverlay} ${mobileOpen ? styles.open : ''}`}>
                <div className={styles.mobileLinks}>
                    {nav.map((item) => (
                        <Link key={item.href} href={item.href} className={styles.mobileLink} onClick={() => setMobileOpen(false)}>{item.label}</Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}

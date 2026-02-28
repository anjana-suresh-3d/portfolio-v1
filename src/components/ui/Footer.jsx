'use client';

import Link from 'next/link';
import { Instagram, Linkedin, ArrowUp } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import styles from './Footer.module.css';

const nav = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Contact', href: '/contact' },
];

export default function Footer() {
    const c = useContent();

    return (
        <footer className={styles.footer} id="footer">
            <div className={styles.container}>
                <div className={styles.top}>
                    <div className={styles.brand}>
                        <span className={styles.brandName}>{c['nav.brand'] || 'Anjana Suresh'}</span>
                        <span className={styles.brandTitle}>{c['footer.tagline'] || 'Designing spaces that inspire.'}</span>
                    </div>
                    <div className={styles.links}>
                        {nav.map((item) => (
                            <Link key={item.href} href={item.href} className={styles.link}>{item.label}</Link>
                        ))}
                    </div>
                    <div className={styles.social}>
                        {c['social.instagram'] && (
                            <a href={c['social.instagram']} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialIcon}><Instagram size={18} /></a>
                        )}
                        {c['social.linkedin'] && (
                            <a href={c['social.linkedin']} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.socialIcon}><Linkedin size={18} /></a>
                        )}
                    </div>
                </div>
                <div className={styles.bottom}>
                    <p className={styles.copyright}>{c['footer.copyright'] || `© ${new Date().getFullYear()} Anjana Suresh. All rights reserved.`}</p>
                    <button className={styles.backToTop} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ArrowUp size={16} /></button>
                </div>
            </div>
        </footer>
    );
}

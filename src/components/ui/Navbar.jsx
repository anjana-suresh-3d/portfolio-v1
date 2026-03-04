'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useContent } from '@/hooks/useContent';
import { Menu, X } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import MagneticButton from './MagneticButton';
import styles from './Navbar.module.css';

const nav = [
    { label: 'Home', href: '/' },
    { label: 'Vision', href: '/#vision' },
    { label: 'Services', href: '/#services' },
    { label: 'Journey', href: '/#journey' },
    { label: 'Work', href: '/#work' },
    { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { scrollY } = useScroll();
    const c = useContent();

    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious();
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }
        setScrolled(latest > 50);
    });

    const handleScroll = (e, href) => {
        if (href.startsWith('/#') && (pathname === '/' || pathname === '')) {
            e.preventDefault();
            const id = href.replace('/#', '');
            const element = document.getElementById(id);
            if (element) {
                const navHeight = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
                setMobileOpen(false);
            }
        }
    };

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    return (
        <motion.nav
            variants={{
                visible: { y: 0, opacity: 1 },
                hidden: { y: "-100%", opacity: 0 }
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
            id="main-nav"
        >
            <div className={styles.inner}>
                <Link href="/" className={styles.logo} aria-label="Home">
                    <span className={styles.logoName}>{c['nav.brand'] || 'Anjana Suresh'}</span>
                    <span className={styles.logoTitle}>Interior Designer</span>
                </Link>

                <div className={styles.desktopLinks}>
                    {nav.map((item) => (
                        <MagneticButton key={item.href}>
                            <Link
                                href={item.href}
                                className={styles.navLink}
                                onClick={(e) => handleScroll(e, item.href)}
                            >
                                {item.label}
                            </Link>
                        </MagneticButton>
                    ))}
                </div>

                <div className={styles.mobileToggle}>
                    <MagneticButton>
                        <button onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
                            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </MagneticButton>
                </div>
            </div>

            <div className={`${styles.mobileOverlay} ${mobileOpen ? styles.open : ''}`}>
                <div className={styles.mobileLinks}>
                    {nav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={styles.mobileLink}
                            onClick={(e) => {
                                handleScroll(e, item.href);
                                setMobileOpen(false);
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </motion.nav>
    );
}

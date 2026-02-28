import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './InfiniteCarousel.module.css';

export default function InfiniteCarousel({ images, onImageClick }) {
    const scrollRef = useRef(null);
    const [isPaused, setIsPaused] = useState(false);

    const scroll = useCallback((direction) => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const scrollAmount = window.innerWidth < 768 ? 320 : window.innerWidth < 1200 ? 400 : 450;

        const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;

        if (direction === 'right' && isAtEnd) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    }, []);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            scroll('right');
        }, 3500); // Scroll every 3.5 seconds

        return () => clearInterval(interval);
    }, [isPaused, scroll]);

    return (
        <div
            className={styles.carouselContainer}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={() => scroll('left')} aria-label="Previous image">
                <ChevronLeft size={24} />
            </button>

            <div className={styles.track} ref={scrollRef}>
                {images.map((img, idx) => (
                    <CarouselSlide key={`slide-${idx}`} img={img} onClick={() => onImageClick && onImageClick(img)} />
                ))}
            </div>

            <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={() => scroll('right')} aria-label="Next image">
                <ChevronRight size={24} />
            </button>
        </div>
    );
}

function CarouselSlide({ img, onClick }) {
    const imageUrl = img.url || img.src || img.image || img.coverImage;

    if (!imageUrl) return null;

    return (
        <div className={styles.slide} onClick={onClick}>
            <div className={styles.imageWrapper}>
                <img
                    src={imageUrl}
                    alt={img.alt || img.title || 'Project image'}
                    className={styles.image}
                    loading="lazy"
                />

                {/* Premium Dark Gradient Overlay */}
                <div className={styles.overlay}>
                    <div className={styles.descriptionContainer}>
                        <div className={styles.glassLabel}>View Detail</div>
                        {img.title && <h3 className={styles.projectTitle}>{img.title}</h3>}
                        {img.description && <p className={styles.description}>{img.description}</p>}
                        {img.category && <span className={styles.category}>{img.category}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

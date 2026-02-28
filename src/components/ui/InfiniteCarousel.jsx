import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './InfiniteCarousel.module.css';

export default function InfiniteCarousel({ images, onImageClick }) {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (!scrollRef.current) return;
        const scrollAmount = window.innerWidth < 768 ? 320 : window.innerWidth < 1200 ? 400 : 450;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <div className={styles.carouselContainer}>
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
    return (
        <div className={styles.slide} onClick={onClick}>
            <div className={styles.imageWrapper}>
                <img
                    src={
                        (img.url || img.src || img.image || img.coverImage)?.startsWith('http')
                            ? `/_next/image?url=${encodeURIComponent(img.url || img.src || img.image || img.coverImage)}&w=1920&q=75`
                            : (img.url || img.src || img.image || img.coverImage)
                    }
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

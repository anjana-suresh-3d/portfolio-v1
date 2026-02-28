import { useState } from 'react';
import styles from './InfiniteCarousel.module.css';

export default function InfiniteCarousel({ images, onImageClick }) {
    // Determine how many times to duplicate the set so it fills the screen width comfortably.
    // CSS animation uses translate -33.333% to seamlessly loop 3 equal sets.
    const repeatedImages = [...images, ...images, ...images];

    // Compute animation duration dynamically. More images = more time, so speed feels constant.
    const animationDuration = `${Math.max(20, images.length * 6)}s`;

    return (
        <div className={styles.carouselContainer}>
            <div
                className={styles.track}
                style={{ animationDuration }}
            >
                {/* 3 identical sets for perfect infinite scrolling math */}
                <div className={styles.set}>
                    {images.map((img, idx) => (
                        <CarouselSlide key={`set1-${idx}`} img={img} onClick={() => onImageClick && onImageClick(img)} />
                    ))}
                </div>
                <div className={styles.set} aria-hidden="true">
                    {images.map((img, idx) => (
                        <CarouselSlide key={`set2-${idx}`} img={img} onClick={() => onImageClick && onImageClick(img)} />
                    ))}
                </div>
                <div className={styles.set} aria-hidden="true">
                    {images.map((img, idx) => (
                        <CarouselSlide key={`set3-${idx}`} img={img} onClick={() => onImageClick && onImageClick(img)} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function CarouselSlide({ img, onClick }) {
    return (
        <div className={styles.slide} onClick={onClick}>
            <div className={styles.imageWrapper}>
                <img
                    src={img.url || img.src || img.image || img.coverImage}
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

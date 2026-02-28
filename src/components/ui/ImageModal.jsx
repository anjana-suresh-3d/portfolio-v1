import { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './ImageModal.module.css';

export default function ImageModal({ isOpen, image, onClose }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'auto'; // ensure cleanup just in case
        }
        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !image) return null;

    return (
        <div className={styles.overlay} onClick={onClose} aria-modal="true" role="dialog">
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                    <X size={24} />
                </button>
                <div className={styles.imageContainer}>
                    <img
                        src={
                            (image.url || image.src || image.image)?.startsWith('http')
                                ? `/_next/image?url=${encodeURIComponent(image.url || image.src || image.image)}&w=1920&q=75`
                                : (image.url || image.src || image.image)
                        }
                        alt={image.alt || image.title || 'Project Detail'}
                        className={styles.image}
                    />
                </div>
                {(image.description || image.title) && (
                    <div className={styles.descriptionBar}>
                        {image.title && <h3 className={styles.modalTitle}>{image.title}</h3>}
                        {image.description && <p>{image.description}</p>}
                        {image.year && <span className={styles.meta}>{image.category} • {image.year}</span>}
                    </div>
                )}
            </div>
        </div>
    );
}

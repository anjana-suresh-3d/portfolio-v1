'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function MagneticButton({ children, className, onClick, ...props }) {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouse = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        setPosition({ x: middleX * 0.3, y: middleY * 0.3 }); // 0.3 determines the magnetic strength
    };

    const reset = () => {
        setPosition({ x: 0, y: 0 });
    };

    const { x, y } = position;

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x, y }}
            transition={{ type: 'spring', stiffness: 350, damping: 25, mass: 0.5 }}
            className={`magnetic-btn ${className || ''}`}
            onClick={onClick}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
            }}
            {...props}
        >
            <motion.div
                transition={{ type: 'spring', stiffness: 350, damping: 25, mass: 0.5 }}
                style={{ width: '100%', height: '100%', display: 'flex' }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}

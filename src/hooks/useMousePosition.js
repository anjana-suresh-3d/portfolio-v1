'use client';

import { useState } from 'react';

export function useMousePosition() {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        setPosition({ x, y });
    };

    return { position, handleMouseMove };
}

'use client';

import { useState, useEffect, createContext, useContext } from 'react';

const ContentContext = createContext({ content: {}, isLoading: true });

export function ContentProvider({ children, initialContent = {} }) {
    const [content, setContent] = useState(initialContent);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/content')
            .then((res) => res.json())
            .then((data) => {
                if (data && !data.error) setContent(data);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
    }, []);

    return <ContentContext.Provider value={{ content, isLoading }}>{children}</ContentContext.Provider>;
}

export function useContent() {
    const context = useContext(ContentContext);
    return context.content || {};
}

export function useIsLoading() {
    const context = useContext(ContentContext);
    return context.isLoading;
}

export function useContentValue(key, fallback = '') {
    const context = useContext(ContentContext);
    const content = context.content || {};
    return content[key] || fallback;
}

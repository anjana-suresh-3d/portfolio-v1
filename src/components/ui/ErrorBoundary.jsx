'use client';

import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Component Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', textAlign: 'center', background: '#f8d7da', color: '#842029', borderRadius: '8px', margin: '1rem 0' }}>
                    <h3>Failed to load component</h3>
                    <p>There was a network or graphics error loading this element.</p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>{this.state.error?.message}</p>
                </div>
            );
        }
        return this.props.children;
    }
}

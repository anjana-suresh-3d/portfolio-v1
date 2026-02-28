'use client';

import { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { Send, CheckCircle } from 'lucide-react';
import { ContentProvider, useContent } from '@/hooks/useContent';
import styles from './contact.module.css';

function ContactPageContent() {
    const [form, setForm] = useState({ name: '', email: '', projectType: '', message: '' });
    const [status, setStatus] = useState('idle');
    const c = useContent();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setStatus('sent');
                setForm({ name: '', email: '', projectType: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.info}>
                        <div className={styles.labelRow}>
                            <div className={styles.line} />
                            <span className={styles.label}>{c['contact.label'] || 'Contact'}</span>
                        </div>
                        <h1 className={styles.heading}>
                            {c['contact.heading'] || "Let's bring your vision to life."}
                        </h1>
                        <p className={styles.desc}>
                            {c['contact.description'] || "Whether you're planning a renovation, building from scratch, or simply looking for design guidance — I&apos;d love to hear about your project."}
                        </p>
                        <div className={styles.details}>
                            <div className={styles.detail}>
                                <span className={styles.detailLabel}>Email</span>
                                <a href={`mailto:${c['contact.email'] || 'hello@anjanasuresh.com'}`} className={styles.detailValue}>
                                    {c['contact.email'] || 'hello@anjanasuresh.com'}
                                </a>
                            </div>
                            <div className={styles.detail}>
                                <span className={styles.detailLabel}>Location</span>
                                <span className={styles.detailValue}>{c['contact.location'] || 'India'}</span>
                            </div>
                        </div>
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        {status === 'sent' ? (
                            <div className={styles.success}>
                                <CheckCircle size={40} />
                                <h3>Message sent!</h3>
                                <p>Thank you for reaching out. I&apos;ll get back to you soon.</p>
                                <button type="button" className={styles.resetBtn} onClick={() => setStatus('idle')}>
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className={styles.field}>
                                    <label htmlFor="name">Full Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Your name"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="projectType">Project Type</label>
                                    <select
                                        id="projectType"
                                        value={form.projectType}
                                        onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                                    >
                                        <option value="">Select a type</option>
                                        <option value="residential">Residential</option>
                                        <option value="commercial">Commercial</option>
                                        <option value="hospitality">Hospitality</option>
                                        <option value="consultation">Consultation</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className={styles.field}>
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        required
                                        rows={5}
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        placeholder="Tell me about your project..."
                                    />
                                </div>
                                <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
                                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                                    <Send size={16} />
                                </button>
                                {status === 'error' && (
                                    <p className={styles.errorMsg}>Something went wrong. Please try again.</p>
                                )}
                            </>
                        )}
                    </form>
                </div>
            </div>
        </main>
    );
}

export default function ContactPage() {
    return (
        <ContentProvider>
            <Navbar />
            <ContactPageContent />
            <Footer />
        </ContentProvider>
    );
}

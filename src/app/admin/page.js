'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, LogOut, Upload, X, Save, Lock, FileText, Settings, Layers } from 'lucide-react';
import styles from './admin.module.css';

const CONTENT_SECTIONS = [
    {
        label: 'Global Settings', keys: [
            { key: 'nav.brand', label: 'Brand Name' },
            { key: 'site.loader', label: 'Site Loader (GIF/PNG)', type: 'image' },
        ]
    },
    {
        label: 'Hero Section', keys: [
            { key: 'hero.label', label: 'Label' },
            { key: 'hero.title', label: 'Title' },
            { key: 'hero.titleAccent', label: 'Title (Gold Text)' },
            { key: 'hero.subtitle', label: 'Subtitle' },
            { key: 'hero.cta', label: 'CTA Button Text' },
        ]
    },
    {
        label: 'About Preview (Homepage)', keys: [
            { key: 'about.label', label: 'Section Label' },
            { key: 'about.heading', label: 'Heading' },
            { key: 'about.description', label: 'Description', type: 'textarea' },
            { key: 'about.stat1.number', label: 'Stat 1 Number' },
            { key: 'about.stat1.label', label: 'Stat 1 Label' },
            { key: 'about.stat2.number', label: 'Stat 2 Number' },
            { key: 'about.stat2.label', label: 'Stat 2 Label' },
            { key: 'about.stat3.number', label: 'Stat 3 Number' },
            { key: 'about.stat3.label', label: 'Stat 3 Label' },
            { key: 'about.quote', label: 'Quote' },
        ]
    },
    {
        label: 'About Page', keys: [
            { key: 'aboutPage.heading', label: 'Page Heading' },
            { key: 'aboutPage.story', label: 'My Story (Paragraph 1)', type: 'textarea' },
            { key: 'aboutPage.story2', label: 'My Story (Paragraph 2)', type: 'textarea' },
            { key: 'aboutPage.philosophy', label: 'Philosophy', type: 'textarea' },
            { key: 'aboutPage.tools', label: 'Tools (pipe-separated)', type: 'textarea' },
        ]
    },
    {
        label: 'Services', keys: [
            { key: 'services.label', label: 'Section Label' },
            { key: 'services.heading', label: 'Section Heading' },
            { key: 'services.1.title', label: 'Service 1 Title' },
            { key: 'services.1.desc', label: 'Service 1 Description', type: 'textarea' },
            { key: 'services.2.title', label: 'Service 2 Title' },
            { key: 'services.2.desc', label: 'Service 2 Description', type: 'textarea' },
            { key: 'services.3.title', label: 'Service 3 Title' },
            { key: 'services.3.desc', label: 'Service 3 Description', type: 'textarea' },
            { key: 'services.4.title', label: 'Service 4 Title' },
            { key: 'services.4.desc', label: 'Service 4 Description', type: 'textarea' },
        ]
    },
    {
        label: 'Contact', keys: [
            { key: 'contact.label', label: 'Section Label' },
            { key: 'contact.heading', label: 'Heading' },
            { key: 'contact.description', label: 'Description', type: 'textarea' },
            { key: 'contact.email', label: 'Email Address' },
            { key: 'contact.location', label: 'Location' },
            { key: 'contact.cta', label: 'CTA Button Text' },
        ]
    },
    {
        label: 'Footer & Social', keys: [
            { key: 'footer.copyright', label: 'Copyright Text' },
            { key: 'footer.tagline', label: 'Tagline' },
            { key: 'social.instagram', label: 'Instagram URL' },
            { key: 'social.linkedin', label: 'LinkedIn URL' },
            { key: 'social.pinterest', label: 'Pinterest URL' },
        ]
    },
];

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        title: '', description: '', category: 'Residential',
        year: new Date().getFullYear().toString(), location: '',
        featured: false, published: false, coverImage: '', modelUrl: '', showModel: true,
        images: [], // Gallery images [{url: path, alt: '', description: ''}]
    });

    // Temp previews for newly uploaded assets
    const [previews, setPreviews] = useState({});

    // Content editor state
    const [content, setContent] = useState({});
    const [contentLoading, setContentLoading] = useState(false);
    const [contentSaving, setContentSaving] = useState(false);
    const [contentSaved, setContentSaved] = useState(false);

    // Password state
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [pwStatus, setPwStatus] = useState({ type: '', msg: '' });

    const loadProjects = useCallback(() => {
        fetch('/api/projects')
            .then((res) => res.json())
            .then((data) => { setProjects(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const loadContent = useCallback(() => {
        setContentLoading(true);
        fetch('/api/content')
            .then((res) => res.json())
            .then((data) => { setContent(data); setContentLoading(false); })
            .catch(() => setContentLoading(false));
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/admin/login');
        if (status === 'authenticated') { loadProjects(); loadContent(); }
    }, [status, router, loadProjects, loadContent]);

    const resetForm = () => {
        setForm({ title: '', description: '', category: 'Residential', year: new Date().getFullYear().toString(), location: '', featured: false, published: false, coverImage: '', modelUrl: '', showModel: true, images: [] });
        setPreviews({});
        setEditingId(null);
        setShowForm(false);
    };

    const handleUpload = async (e, field, isGallery = false, isContent = false) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (res.ok && data.path) {
                if (isGallery) {
                    setForm(prev => ({
                        ...prev,
                        images: [...prev.images, { url: data.path, alt: '', description: '' }]
                    }));
                    setPreviews(prev => ({ ...prev, [data.path]: data.url }));
                } else if (isContent) {
                    setContent(prev => ({ ...prev, [field]: data.url })); // Use signed URL for immediate content preview
                } else {
                    setForm((prev) => ({ ...prev, [field]: data.path }));
                    setPreviews(prev => ({ ...prev, [field]: data.url }));
                }
            } else {
                alert(data.error || 'Upload failed');
            }
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Network error during upload');
        }
        setUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
        try {
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            if (res.ok) {
                resetForm();
                loadProjects();
            } else {
                const data = await res.json();
                alert(`Save failed: ${data.error || 'Unknown error'}`);
            }
        } catch (err) {
            console.error('Save failed:', err);
            alert('Network error while saving project.');
        }
    };

    const handleEdit = (project) => {
        setForm({
            title: project.title, description: project.description, category: project.category,
            year: project.year, location: project.location || '', featured: project.featured,
            published: project.published, coverImage: project.coverImage, modelUrl: project.modelUrl || '',
            showModel: project.showModel !== undefined ? project.showModel : true,
            images: project.images || [],
        });
        // For existing images, the 'url' in the DB is currently signed but moving to paths.
        // The API returns signed URLs. We should be careful about not overwriting paths with signed URLs if we save again.
        // Actually, the API GET now returns signed URLs. When we save, we should send back the original paths if possible.
        // But for now, let's just make it work.
        setEditingId(project.id);
        setShowForm(true);
    };

    const handleGalleryChange = (index, field, value) => {
        const newImages = [...form.images];
        newImages[index][field] = value;
        setForm({ ...form, images: newImages });
    };

    const removeGalleryImage = (index) => {
        const newImages = form.images.filter((_, i) => i !== index);
        setForm({ ...form, images: newImages });
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this project?')) return;
        await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        loadProjects();
    };

    const togglePublish = async (project) => {
        await fetch(`/api/projects/${project.id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ published: !project.published }),
        });
        loadProjects();
    };

    const saveContent = async () => {
        setContentSaving(true);
        try {
            const res = await fetch('/api/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) });
            if (res.ok) { setContentSaved(true); setTimeout(() => setContentSaved(false), 3000); }
        } catch (err) { console.error('Save failed:', err); }
        setContentSaving(false);
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setPwStatus({ type: '', msg: '' });

        if (pwForm.newPassword !== pwForm.confirmPassword) {
            setPwStatus({ type: 'error', msg: 'Passwords do not match' });
            return;
        }

        try {
            const res = await fetch('/api/admin/password', {
                method: 'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: session?.user?.email, currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
            });
            const data = await res.json();
            if (res.ok) {
                setPwStatus({ type: 'success', msg: 'Password updated successfully!' });
                setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setPwStatus({ type: 'error', msg: data.error || 'Failed to update password' });
            }
        } catch { setPwStatus({ type: 'error', msg: 'Network error' }); }
    };

    if (status === 'loading') return <div className={styles.page}><p>Loading...</p></div>;
    if (status === 'unauthenticated') return null;

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1>Dashboard</h1>
                    <span className={styles.welcome}>Welcome, {session?.user?.name}</span>
                </div>
                <div className={styles.headerRight}>
                    <button className={styles.logoutBtn} onClick={() => signOut({ callbackUrl: '/' })} title="Sign Out">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button className={`${styles.tab} ${activeTab === 'projects' ? styles.activeTab : ''}`} onClick={() => setActiveTab('projects')}>
                    <Layers size={16} /> Projects
                </button>
                <button className={`${styles.tab} ${activeTab === 'content' ? styles.activeTab : ''}`} onClick={() => setActiveTab('content')}>
                    <FileText size={16} /> Site Content
                </button>
                <button className={`${styles.tab} ${activeTab === 'settings' ? styles.activeTab : ''}`} onClick={() => setActiveTab('settings')}>
                    <Settings size={16} /> Settings
                </button>
            </div>

            {/* Projects Tab */}
            {activeTab === 'projects' && (
                <>
                    <div className={styles.tabHeader}>
                        <div className={styles.stats}>
                            <div className={styles.statCard}><span className={styles.statNum}>{projects.length}</span><span className={styles.statLabel}>Total Projects</span></div>
                            <div className={styles.statCard}><span className={styles.statNum}>{projects.filter(p => p.published).length}</span><span className={styles.statLabel}>Published</span></div>
                            <div className={styles.statCard}><span className={styles.statNum}>{projects.filter(p => p.featured).length}</span><span className={styles.statLabel}>Featured</span></div>
                        </div>
                        <button className={styles.addBtn} onClick={() => { resetForm(); setShowForm(true); }}><Plus size={16} /> New Project</button>
                    </div>

                    {showForm && (
                        <div className={styles.formOverlay}>
                            <form className={styles.projectForm} onSubmit={handleSubmit}>
                                {uploading && <div className={styles.uploadProgressBar} />}
                                <div className={styles.formHeader}>
                                    <h2>{editingId ? 'Edit Project' : 'New Project'}</h2>
                                    <button type="button" onClick={resetForm} className={styles.closeBtn}><X size={20} /></button>
                                </div>
                                <div className={styles.formBody}>
                                    <div className={styles.formGrid}>
                                        <div className={styles.field}><label>Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
                                        <div className={styles.field}><label>Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Residential</option><option>Commercial</option><option>Hospitality</option></select></div>
                                        <div className={styles.field}><label>Year</label><input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required /></div>
                                        <div className={styles.field}><label>Location</label><input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                                    </div>
                                    <div className={styles.field}><label>Description</label><textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
                                    <div className={styles.formGrid}>
                                        <div className={styles.uploadField}>
                                            <label>Cover Image</label>
                                            {(previews.coverImage || form.coverImage) && <img src={previews.coverImage || form.coverImage} alt="Cover" className={styles.preview} />}
                                            <label className={styles.uploadBtn}><Upload size={14} /> {uploading ? 'Uploading...' : 'Upload Image'}<input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'coverImage')} hidden /></label>
                                        </div>
                                        <div className={styles.uploadField}>
                                            <label>3D Model (.glb)</label>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {form.modelUrl && <span className={styles.fileName}>{form.modelUrl.split('/').pop()}</span>}
                                                <label className={styles.uploadBtn}><Upload size={14} /> {uploading ? 'Uploading...' : (form.modelUrl ? 'Replace Model' : 'Upload Model')}<input type="file" accept=".glb,.gltf" onChange={(e) => handleUpload(e, 'modelUrl')} hidden /></label>
                                            </div>
                                            {form.modelUrl && (
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '8px' }}>
                                                    <input type="checkbox" checked={form.showModel} onChange={(e) => setForm({ ...form, showModel: e.target.checked })} />
                                                    <span style={{ fontSize: '0.85rem' }}>Show 3D model to public</span>
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    {/* Gallery Sections */}
                                    <div className={styles.galleryEditor}>
                                        <h3>Project Gallery</h3>
                                        <div className={styles.galleryItems}>
                                            {form.images.map((img, idx) => (
                                                <div key={idx} className={styles.galleryItemForm}>
                                                    <div className={styles.galleryItemTop}>
                                                        <img src={previews[img.url] || img.url} alt="" className={styles.galleryThumb} />
                                                        <button type="button" onClick={() => removeGalleryImage(idx)} className={styles.removeImgBtn}><Trash2 size={14} /></button>
                                                    </div>
                                                    <div className={styles.galleryItemFields}>
                                                        <input
                                                            placeholder="Short Description..."
                                                            value={img.description}
                                                            onChange={(e) => handleGalleryChange(idx, 'description', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <label className={styles.addGalleryBtn}>
                                            <Plus size={16} /> Add to Gallery
                                            <input type="file" accept="image/*" onChange={(e) => handleUpload(e, null, true)} hidden />
                                        </label>
                                    </div>

                                </div>
                                <div className={styles.formFooter}>
                                    <div className={styles.toggles}>
                                        <label className={styles.toggle}><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /><span>Published</span></label>
                                        <label className={styles.toggle}><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /><span>Featured</span></label>
                                    </div>
                                    <button type="submit" className={styles.saveBtn} disabled={uploading}>
                                        {uploading ? 'Uploading assets...' : (editingId ? 'Update Project' : 'Create Project')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className={styles.projectList}>
                        <h2>Projects</h2>
                        {loading ? <p>Loading projects...</p> : projects.length === 0 ? (
                            <p className={styles.empty}>No projects yet. Click "New Project" to create one.</p>
                        ) : (
                            <div className={styles.table}>
                                {projects.map((project) => (
                                    <div key={project.id} className={styles.row}>
                                        <div className={styles.rowInfo}>
                                            <div className={styles.rowThumb}>
                                                {project.coverImage ? <img src={project.coverImage} alt="" /> : <span>{project.title.charAt(0)}</span>}
                                            </div>
                                            <div><h3>{project.title}</h3><span className={styles.rowMeta}>{project.category} · {project.year}</span></div>
                                        </div>
                                        <div className={styles.rowActions}>
                                            {project.featured && <Star size={14} className={styles.starIcon} />}
                                            <button onClick={() => togglePublish(project)} title={project.published ? 'Unpublish' : 'Publish'}>{project.published ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                                            <button onClick={() => handleEdit(project)}><Edit size={16} /></button>
                                            <button onClick={() => handleDelete(project.id)} className={styles.deleteBtn}><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Content Editor Tab */}
            {activeTab === 'content' && (
                <div className={styles.contentEditor}>
                    <div className={styles.contentHeader}>
                        <h2>Edit Site Content</h2>
                        <button className={styles.saveContentBtn} onClick={saveContent} disabled={contentSaving}>
                            <Save size={16} /> {contentSaving ? 'Saving...' : contentSaved ? 'Saved!' : 'Save All Changes'}
                        </button>
                    </div>
                    {contentLoading ? <p>Loading content...</p> : (
                        <div className={styles.contentSections}>
                            {CONTENT_SECTIONS.map((section) => (
                                <div key={section.label} className={styles.contentSection}>
                                    <h3 className={styles.sectionTitle}>{section.label}</h3>
                                    <div className={styles.contentFields}>
                                        {section.keys.map(({ key, label, type }) => (
                                            <div key={key} className={styles.contentField}>
                                                <label>{label}</label>
                                                {type === 'textarea' ? (
                                                    <textarea rows={3} value={content[key] || ''} onChange={(e) => setContent({ ...content, [key]: e.target.value })} />
                                                ) : type === 'image' ? (
                                                    <div className={styles.contentUpload}>
                                                        {content[key] && <img src={content[key]} alt="" className={styles.contentPreview} />}
                                                        <label className={styles.uploadBtn}>
                                                            <Upload size={14} /> {uploading ? 'Uploading...' : 'Change Asset'}
                                                            <input type="file" accept="image/*" onChange={(e) => handleUpload(e, key, false, true)} hidden />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <input type="text" value={content[key] || ''} onChange={(e) => setContent({ ...content, [key]: e.target.value })} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
                <div className={styles.settingsTab}>
                    <div className={styles.settingsCard}>
                        <h2><Lock size={20} /> Change Password</h2>
                        <form onSubmit={handlePasswordReset}>
                            <div className={styles.field}><label>Current Password</label><input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required /></div>
                            <div className={styles.field}><label>New Password</label><input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required minLength={6} /></div>
                            <div className={styles.field}><label>Confirm New Password</label><input type="password" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} required minLength={6} /></div>
                            {pwStatus.msg && <div className={`${styles.pwMsg} ${pwStatus.type === 'error' ? styles.pwError : styles.pwSuccess}`}>{pwStatus.msg}</div>}
                            <button type="submit" className={styles.saveBtn}>Update Password</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

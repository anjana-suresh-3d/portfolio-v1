import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSignedUrl, getProxiedUrl, stripProxy } from '@/lib/supabase';

// Helper to sign URLs in project data
async function signProjectAssets(project) {
    if (!project) return project;

    // Use a long expiry for performance (e.g., 24 hours)
    const expiry = 24 * 3600;

    if (project.coverImage) {
        if (!project.coverImage.startsWith('http')) {
            const signed = await getSignedUrl(project.coverImage, expiry);
            project.coverImage = getProxiedUrl(signed) || project.coverImage;
        } else {
            project.coverImage = getProxiedUrl(project.coverImage);
        }
    }

    if (project.modelUrl) {
        if (!project.modelUrl.startsWith('http')) {
            const signed = await getSignedUrl(project.modelUrl, expiry);
            project.modelUrl = getProxiedUrl(signed) || project.modelUrl;
        } else {
            project.modelUrl = getProxiedUrl(project.modelUrl);
        }
    }

    if (project.images && Array.isArray(project.images)) {
        project.images = await Promise.all(
            project.images.map(async (img) => {
                if (img.url) {
                    if (!img.url.startsWith('http')) {
                        const signed = await getSignedUrl(img.url, expiry);
                        return { ...img, url: getProxiedUrl(signed) || img.url };
                    } else {
                        return { ...img, url: getProxiedUrl(img.url) };
                    }
                }
                return img;
            })
        );
    }

    return project;
}

// Helper to clean incoming data
function cleanProjectAssets(data) {
    if (!data) return data;
    if (data.coverImage) data.coverImage = stripProxy(data.coverImage);
    if (data.modelUrl) data.modelUrl = stripProxy(data.modelUrl);
    if (data.images && Array.isArray(data.images)) {
        data.images = data.images.map(img => ({
            ...img,
            url: stripProxy(img.url)
        }));
    }
    return data;
}

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const project = await prisma.project.findUnique({
            where: { id },
            include: { images: { orderBy: { order: 'asc' } } },
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const signedProject = await signProjectAssets(project);
        return NextResponse.json(signedProject);
    } catch (error) {
        console.error('Fetch project error:', error);
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const cleanedBody = cleanProjectAssets(body);
        const { title, description, category, year, location, featured, published, coverImage, modelUrl, showModel, images } = cleanedBody;

        const updateData = {};
        if (title !== undefined) {
            updateData.title = title;
            updateData.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;
        if (year !== undefined) updateData.year = year;
        if (location !== undefined) updateData.location = location;
        if (featured !== undefined) updateData.featured = featured;
        if (published !== undefined) updateData.published = published;
        if (coverImage !== undefined) updateData.coverImage = coverImage;
        if (modelUrl !== undefined) updateData.modelUrl = modelUrl;
        if (showModel !== undefined) updateData.showModel = showModel;

        if (images) {
            // Transactional update for images
            await prisma.image.deleteMany({ where: { projectId: id } });
            updateData.images = {
                create: images.map((img, idx) => ({
                    url: img.url, // Storage path
                    alt: img.alt || '',
                    description: img.description || '',
                    order: idx,
                })),
            };
        }

        const project = await prisma.project.update({
            where: { id },
            data: updateData,
            include: { images: true },
        });

        const signedProject = await signProjectAssets(project);
        return NextResponse.json(signedProject);
    } catch (error) {
        console.error('Update project error:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await prisma.project.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete project error:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}

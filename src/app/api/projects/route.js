import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSignedUrl } from '@/lib/supabase';

// Helper to sign URLs in project data
async function signProjectAssets(project) {
    if (!project) return project;

    // Use a long expiry for performance (e.g., 24 hours)
    const expiry = 24 * 3600;

    if (project.coverImage && !project.coverImage.startsWith('http')) {
        project.coverImage = await getSignedUrl(project.coverImage, expiry) || project.coverImage;
    }

    if (project.modelUrl && !project.modelUrl.startsWith('http')) {
        project.modelUrl = await getSignedUrl(project.modelUrl, expiry) || project.modelUrl;
    }

    if (project.images && Array.isArray(project.images)) {
        project.images = await Promise.all(
            project.images.map(async (img) => {
                if (img.url && !img.url.startsWith('http')) {
                    const signed = await getSignedUrl(img.url, expiry);
                    return { ...img, url: signed || img.url };
                }
                return img;
            })
        );
    }

    return project;
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured');
        const published = searchParams.get('published');
        const category = searchParams.get('category');

        const where = {};
        if (featured === 'true') where.featured = true;
        if (published === 'true') where.published = true;
        if (category) where.category = category;

        const projects = await prisma.project.findMany({
            where,
            include: { images: { orderBy: { order: 'asc' } } },
            orderBy: { createdAt: 'desc' },
        });

        // Sign all assets before returning
        const signedProjects = await Promise.all(projects.map(p => signProjectAssets(p)));

        return NextResponse.json(signedProjects);
    } catch (error) {
        console.error('Fetch projects error:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { title, description, category, year, location, featured, published, coverImage, modelUrl, showModel, images } = body;

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const project = await prisma.project.create({
            data: {
                title,
                slug,
                description,
                category,
                year,
                location: location || null,
                featured: featured || false,
                published: published || false,
                coverImage, // This should now be a path from the uploader
                modelUrl: modelUrl || null,
                showModel: showModel !== undefined ? showModel : true,
                images: images?.length
                    ? {
                        create: images.map((img, idx) => ({
                            url: img.url, // Path
                            alt: img.alt || '',
                            description: img.description || '',
                            order: idx,
                        })),
                    }
                    : undefined,
            },
            include: { images: true },
        });

        const signedProject = await signProjectAssets(project);
        return NextResponse.json(signedProject, { status: 201 });
    } catch (error) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'A project with this title already exists' }, { status: 409 });
        }
        console.error('Create project error:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}

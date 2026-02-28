import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all site content (public — used by frontend)
export async function GET() {
    try {
        const entries = await prisma.siteContent.findMany();
        const content = {};
        entries.forEach((e) => { content[e.key] = e.value; });
        return NextResponse.json(content);
    } catch (error) {
        console.error('Content API error:', error);
        return NextResponse.json({ error: 'Failed to fetch content', details: error.message }, { status: 500 });
    }
}

// PUT — update site content (admin only — batch update)
export async function PUT(request) {
    try {
        const body = await request.json();

        const updates = Object.entries(body).map(([key, value]) =>
            prisma.siteContent.upsert({
                where: { key },
                update: { value: String(value) },
                create: { id: key, key, value: String(value) },
            })
        );

        await Promise.all(updates);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Content update error:', error);
        return NextResponse.json({ error: 'Failed to update content', details: error.message }, { status: 500 });
    }
}

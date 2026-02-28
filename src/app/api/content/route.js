import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSignedUrl, getProxiedUrl, stripProxy } from '@/lib/supabase';

// GET all site content (public — used by frontend)
export async function GET() {
    try {
        const entries = await prisma.siteContent.findMany();
        const content = {};

        // Define which keys represent assets that need signing/proxying
        const assetKeys = ['site.loader', 'site.favicon'];

        for (const e of entries) {
            if (assetKeys.includes(e.key) && e.value) {
                // If it's a path, sign it. If it's a URL, proxy it.
                if (!e.value.startsWith('http')) {
                    const signed = await getSignedUrl(e.value, 24 * 3600);
                    content[e.key] = getProxiedUrl(signed) || e.value;
                } else {
                    content[e.key] = getProxiedUrl(e.value);
                }
            } else {
                content[e.key] = e.value;
            }
        }

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

        const updates = Object.entries(body).map(([key, value]) => {
            const cleanValue = stripProxy(String(value));
            return prisma.siteContent.upsert({
                where: { key },
                update: { value: cleanValue },
                create: { id: key, key, value: cleanValue },
            });
        });

        await Promise.all(updates);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Content update error:', error);
        return NextResponse.json({ error: 'Failed to update content', details: error.message }, { status: 500 });
    }
}

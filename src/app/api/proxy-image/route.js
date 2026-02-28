export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const url = searchParams.get('url');

        if (!url) {
            return new NextResponse('Missing URL parameter', { status: 400 });
        }

        // Only proxy requests for our Supabase storage domains to prevent abuse
        // zjfcgiyoojnqozuinnvl is the user's project ref
        if (!url.includes('supabase.co')) {
            return new NextResponse('Unauthorized domain', { status: 403 });
        }

        // Fetch the image from Supabase
        const response = await fetch(url);

        if (!response.ok) {
            return new NextResponse('Failed to proxy image', { status: response.status });
        }

        // Return the image directly with permissive CORS and caching
        const headers = new Headers(response.headers);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=604800');

        // Remove headers that might conflict or reveal too much
        headers.delete('link');
        headers.delete('x-robots-tag');

        return new NextResponse(response.body, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Image Proxy Error:', error);
        return new NextResponse('Internal Image Proxy Error', { status: 500 });
    }
}

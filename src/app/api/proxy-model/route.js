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
        if (!url.includes('supabase.co')) {
            return new NextResponse('Unauthorized domain', { status: 403 });
        }

        // Fetch the model from Supabase
        const response = await fetch(url);

        if (!response.ok) {
            return new NextResponse('Failed to proxy model', { status: response.status });
        }

        // Return the stream directly with the appropriate CORS and content headers
        const headers = new Headers(response.headers);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800');

        return new NextResponse(response.body, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Proxy Error:', error);
        return new NextResponse('Internal Proxy Error', { status: 500 });
    }
}

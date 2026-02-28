import { NextResponse } from 'next/server';
import { supabaseAdmin, STORAGE_BUCKET, getSignedUrl } from '@/lib/supabase';

export async function POST(request) {
    try {
        const { filename, contentType } = await request.json();

        if (!filename) {
            return NextResponse.json({ error: 'No filename provided' }, { status: 400 });
        }

        const timestamp = Date.now();
        const ext = filename.split('.').pop();
        const safeName = filename
            .replace(/\.[^.]+$/, '')
            .replace(/[^a-z0-9]/gi, '-')
            .toLowerCase();
        const filePath = `${safeName}-${timestamp}.${ext}`;

        // Generate a Signed Upload URL from Supabase
        const { data, error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .createSignedUploadUrl(filePath);

        if (error) {
            console.error('Supabase token error:', error);
            return NextResponse.json({ error: 'Failed to generate upload URL: ' + error.message }, { status: 500 });
        }

        // Also generate a read-only signed url so the admin UI can preview it immediately
        const previewUrl = await getSignedUrl(data.path, 365 * 24 * 3600);

        return NextResponse.json({
            uploadUrl: data.signedUrl,
            token: data.token,
            path: data.path,
            previewUrl: previewUrl
        });

    } catch (error) {
        console.error('Upload token error:', error);
        return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
    }
}

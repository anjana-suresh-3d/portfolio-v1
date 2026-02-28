import { NextResponse } from 'next/server';
import { supabaseAdmin, STORAGE_BUCKET, getSignedUrl } from '@/lib/supabase';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        const ext = file.name.split('.').pop();
        const safeName = file.name
            .replace(/\.[^.]+$/, '')
            .replace(/[^a-z0-9]/gi, '-')
            .toLowerCase();
        const filePath = `${safeName}-${timestamp}.${ext}`;

        // Upload to Supabase Storage (private bucket)
        const { data, error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return NextResponse.json({ error: 'Upload failed: ' + error.message }, { status: 500 });
        }

        // Generate a signed URL for the uploaded file (1 year expiry for portfolio assets)
        const signedUrl = await getSignedUrl(data.path, 365 * 24 * 3600);

        // Store the file path (not the signed URL) in the DB — we regenerate signed URLs on read
        return NextResponse.json({
            url: signedUrl,
            path: data.path,
            filename: filePath,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

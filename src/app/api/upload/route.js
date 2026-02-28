import { NextResponse } from 'next/server';
import { supabaseAdmin, STORAGE_BUCKET } from '@/lib/supabase';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name;
        const contentType = file.type;

        const timestamp = Date.now();
        const ext = filename.split('.').pop();
        const safeName = filename
            .replace(/\.[^.]+$/, '')
            .replace(/[^a-z0-9]/gi, '-')
            .toLowerCase();
        const filePath = `${safeName}-${timestamp}.${ext}`;

        // Upload to Supabase using the service role key (bypasses RLS/CORS)
        const { data, error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, buffer, {
                contentType,
                upsert: true
            });

        if (error) {
            console.error('Supabase server-side upload error:', error);
            return NextResponse.json({ error: 'Failed to upload to storage: ' + error.message }, { status: 500 });
        }

        return NextResponse.json({
            path: data.path,
            success: true
        });

    } catch (error) {
        console.error('Server-side upload error:', error);
        return NextResponse.json({ error: 'Internal server error while uploading' }, { status: 500 });
    }
}

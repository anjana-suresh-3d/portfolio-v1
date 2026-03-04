import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase credentials missing — storage uploads will fail');
}

// Server-side client with service_role for admin operations (uploads, signed URLs)
export const supabaseAdmin = createClient(supabaseUrl || '', supabaseServiceKey || '', {
    auth: { persistSession: false },
});

// Bucket name
export const STORAGE_BUCKET = 'portfolio-assets';

// Get a public URL for a file (renamed functionally, keeping async for backward compatibility with callers)
export async function getSignedUrl(filePath, expiresIn = 3600) {
    if (!filePath) return null;

    // If it's already an absolute URL, return it
    if (filePath.startsWith('http')) return filePath;

    const { data } = supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

    return data.publicUrl;
}

// Proxies are disabled, just return the URL
export function getProxiedUrl(url) {
    return url;
}

// Proxies are disabled, just return the URL
export function stripProxy(url) {
    return url;
}

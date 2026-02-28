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

// Generate a signed URL for private files (expires in 1 hour)
export async function getSignedUrl(filePath, expiresIn = 3600) {
    if (!filePath) return null;

    // If it's already an absolute URL, return it
    if (filePath.startsWith('http')) return filePath;

    const { data, error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(filePath, expiresIn);

    if (error) {
        console.error('Error creating signed URL:', error);
        return null;
    }

    return data.signedUrl;
}

// Wrap any URL (signed or public) in our server-side proxy to bypass ISP blocks/CORS
export function getProxiedUrl(url) {
    if (!url) return url;
    if (!url.includes('supabase.co')) return url;
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

// Revert a proxied URL back to its original path or absolute URL
export function stripProxy(url) {
    if (!url || typeof url !== 'string') return url;
    if (url.includes('/api/proxy-image?url=')) {
        return decodeURIComponent(url.split('/api/proxy-image?url=')[1]);
    }
    if (url.includes('/api/proxy-model?url=')) {
        return decodeURIComponent(url.split('/api/proxy-model?url=')[1]);
    }
    return url;
}

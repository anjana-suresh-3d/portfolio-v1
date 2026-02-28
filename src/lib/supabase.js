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
    const { data, error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(filePath, expiresIn);

    if (error) {
        console.error('Error creating signed URL:', error);
        return null;
    }

    return data.signedUrl;
}

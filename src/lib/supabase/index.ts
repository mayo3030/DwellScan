import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side client with service role
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Client-side client
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export type StorageBucket = 'avatars' | 'documents' | 'reports' | 'ai-scans';

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  file: File | Buffer,
  contentType?: string,
): Promise<{ url: string; path: string }> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return { url: publicUrl, path: data.path };
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(bucket: StorageBucket, path: string): Promise<void> {
  const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}

/**
 * Generate a signed URL for temporary access
 */
export async function getSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresIn: number = 3600,
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) throw new Error(`Signed URL failed: ${error.message}`);
  return data.signedUrl;
}

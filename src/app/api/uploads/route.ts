import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionWithUser } from '@/lib/auth';
import { uploadFile } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const result = await getSessionWithUser();
  if (!result) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    const bucket = type === 'INSPECTION_REPORT' ? 'reports'
      : type === 'AI_SCAN_MEDIA' ? 'ai-scans'
      : type === 'AVATAR' ? 'avatars'
      : 'documents';

    const path = `${result.user.id}/${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploaded = await uploadFile(bucket, path, buffer, file.type);

    const doc = await prisma.uploadedDocument.create({
      data: {
        userId: result.user.id,
        inspectorProfileId: result.user.inspectorProfile?.id,
        type: type as any,
        fileName: file.name,
        fileUrl: uploaded.url,
        fileSizeBytes: file.size,
        mimeType: file.type,
      },
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

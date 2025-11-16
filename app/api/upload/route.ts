import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType, orderId, documentIndex } = await request.json();

    // Validate file type
    const allowedTypes = ['image/png', 'image/heic', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Generate encrypted filename
    const timestamp = Date.now();
    const hash = crypto.createHash('sha256').update(`${orderId}-${timestamp}`).digest('hex').substring(0, 12);
    const ext = fileName.split('.').pop();
    const key = `apostilles/${orderId}/${documentIndex}-${hash}.${ext}`;

    // Set auto-delete metadata
    const metadata = {
      'x-amz-meta-order-id': orderId,
      'x-amz-meta-document-index': documentIndex.toString(),
      'x-amz-meta-original-name': fileName,
      'x-amz-meta-upload-date': new Date().toISOString(),
      'x-amz-meta-auto-delete': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };

    // Generate presigned upload URL
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
      ContentType: fileType,
      Metadata: metadata,
    });

    const uploadUrl = await getSignedUrl(R2, command, { expiresIn: 3600 }); // 1 hour expiry

    // Log upload initiation (for audit trail)
    console.log(`Upload initiated: Order ${orderId}, Doc ${documentIndex}, Key: ${key}`);

    return NextResponse.json({
      uploadUrl,
      key,
      expiresIn: 3600
    });
  } catch (error) {
    console.error('R2 upload error:', error);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}

// GET endpoint for generating download URLs
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const key = searchParams.get('key');
  const orderId = searchParams.get('orderId');

  if (!key || !orderId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: key,
    });

    const downloadUrl = await getSignedUrl(R2, command, { expiresIn: 3600 });

    // Log download request (audit trail)
    console.log(`Download requested: Order ${orderId}, Key: ${key}`);

    return NextResponse.json({ downloadUrl });
  } catch (error) {
    console.error('R2 download error:', error);
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const imageUrl = formData.get('imageUrl') as string | null;
    const format = formData.get('format') as string;
    let buffer: Buffer;

    if (!format) {
      return NextResponse.json(
        { error: 'Format is required' },
        { status: 400 }
      );
    }

    if (file) {
      buffer = Buffer.from(await file.arrayBuffer());
    } else if (imageUrl) {
      const response = await fetch(imageUrl);
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      return NextResponse.json(
        { error: 'Either file or image URL is required' },
        { status: 400 }
      );
    }

    let convertedBuffer;
    const timestamp = Date.now();
    const filename = `converted_${timestamp}`;

    switch (format.toLowerCase()) {
      case 'webp':
        convertedBuffer = await sharp(buffer)
          .webp({ quality: 80, lossless: false })
          .toBuffer();
        break;
      case 'jpg':
      case 'jpeg':
        convertedBuffer = await sharp(buffer)
          .jpeg({ quality: 80, mozjpeg: true })
          .toBuffer();
        break;
      case 'png':
        convertedBuffer = await sharp(buffer)
          .png({ compressionLevel: 9, palette: true })
          .toBuffer();
        break;
      case 'avif':
        convertedBuffer = await sharp(buffer)
          .avif({ quality: 80 })
          .toBuffer();
        break;
      case 'tiff':
        convertedBuffer = await sharp(buffer)
          .tiff({ quality: 80, compression: 'jpeg' })
          .toBuffer();
        break;
      case 'gif':
        convertedBuffer = await sharp(buffer)
          .gif()
          .toBuffer();
        break;
      default:
        return NextResponse.json(
          { error: 'Unsupported format' },
          { status: 400 }
        );
    }

    return new NextResponse(convertedBuffer, {
      headers: {
        'Content-Type': `image/${format.toLowerCase()}`,
        'Content-Disposition': `attachment; filename="${filename}.${format.toLowerCase()}"`,
      },
    });
  } catch (error) {
    console.error('Error converting image:', error);
    return NextResponse.json(
      { error: 'Error converting image' },
      { status: 500 }
    );
  }
}
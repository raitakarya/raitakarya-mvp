import cloudinary from '../config/cloudinary';
import sharp from 'sharp';
import { Readable } from 'stream';

interface UploadOptions {
  folder?: string;
  width?: number;
  height?: number;
  quality?: number;
}

/**
 * Upload image to Cloudinary with automatic compression
 * @param buffer Image buffer from multer
 * @param options Upload options (folder, dimensions, quality)
 * @returns Cloudinary upload result with secure_url
 */
export async function uploadImage(
  buffer: Buffer,
  options: UploadOptions = {}
): Promise<{ url: string; publicId: string }> {
  const {
    folder = 'raitakarya',
    width = 800,
    height = 800,
    quality = 80
  } = options;

  try {
    // Compress and resize image using Sharp
    const compressedBuffer = await sharp(buffer)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality })
      .toBuffer();

    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id
            });
          } else {
            reject(new Error('Upload failed - no result returned'));
          }
        }
      );

      // Create readable stream from buffer and pipe to Cloudinary
      const readableStream = new Readable();
      readableStream.push(compressedBuffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  } catch (error) {
    throw new Error(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete image from Cloudinary
 * @param publicId Cloudinary public ID
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Failed to delete image');
  }
}

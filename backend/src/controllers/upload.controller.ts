import { Request, Response } from 'express';
import { uploadImage } from '../utils/imageUpload';
import { prisma } from '../utils/prisma';

/**
 * Upload profile photo for authenticated user
 */
export async function uploadProfilePhoto(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Upload image to Cloudinary
    const { url } = await uploadImage(req.file.buffer, {
      folder: 'raitakarya/profiles',
      width: 500,
      height: 500,
      quality: 85
    });

    // Update user profile with image URL
    await prisma.user.update({
      where: { id: userId },
      data: { profileImage: url }
    });

    res.json({
      success: true,
      url,
      message: 'Profile photo uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Upload job photo (for farmers posting jobs)
 */
export async function uploadJobPhoto(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Upload image to Cloudinary
    const { url } = await uploadImage(req.file.buffer, {
      folder: 'raitakarya/jobs',
      width: 1200,
      height: 900,
      quality: 85
    });

    res.json({
      success: true,
      url,
      message: 'Job photo uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

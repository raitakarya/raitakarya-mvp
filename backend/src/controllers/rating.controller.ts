import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const createRating = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { revieweeId, rating, comment } = req.body;

    if (!revieweeId || !rating) {
      return res.status(400).json({ error: 'Reviewee ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (req.user.userId === revieweeId) {
      return res.status(400).json({ error: 'You cannot rate yourself' });
    }

    const reviewee = await prisma.user.findUnique({
      where: { id: revieweeId }
    });

    if (!reviewee) {
      return res.status(404).json({ error: 'Reviewee not found' });
    }

    const existingRating = await prisma.rating.findUnique({
      where: {
        reviewerId_revieweeId: {
          reviewerId: req.user.userId,
          revieweeId
        }
      }
    });

    if (existingRating) {
      const updatedRating = await prisma.rating.update({
        where: {
          reviewerId_revieweeId: {
            reviewerId: req.user.userId,
            revieweeId
          }
        },
        data: {
          rating: parseInt(rating),
          comment
        },
        include: {
          reviewer: {
            select: {
              id: true,
              name: true
            }
          },
          reviewee: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      await updateAverageRating(revieweeId);

      return res.json({ message: 'Rating updated successfully', rating: updatedRating });
    }

    const newRating = await prisma.rating.create({
      data: {
        reviewerId: req.user.userId,
        revieweeId,
        rating: parseInt(rating),
        comment
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true
          }
        },
        reviewee: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    await updateAverageRating(revieweeId);

    res.status(201).json({ message: 'Rating created successfully', rating: newRating });
  } catch (error: any) {
    console.error('Create rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRatingsForUser = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const ratings = await prisma.rating.findMany({
      where: {
        revieweeId: userId
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    res.json({
      ratings,
      averageRating: parseFloat(averageRating.toFixed(2)),
      totalRatings: ratings.length
    });
  } catch (error: any) {
    console.error('Get ratings for user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteRating = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const rating = await prisma.rating.findUnique({
      where: { id }
    });

    if (!rating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    if (rating.reviewerId !== req.user.userId) {
      return res.status(403).json({ error: 'You can only delete your own ratings' });
    }

    await prisma.rating.delete({
      where: { id }
    });

    await updateAverageRating(rating.revieweeId);

    res.json({ message: 'Rating deleted successfully' });
  } catch (error: any) {
    console.error('Delete rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

async function updateAverageRating(userId: string) {
  const ratings = await prisma.rating.findMany({
    where: { revieweeId: userId }
  });

  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      workerProfile: true,
      farmerProfile: true
    }
  });

  if (user?.workerProfile) {
    await prisma.workerProfile.update({
      where: { userId },
      data: { averageRating: parseFloat(averageRating.toFixed(2)) }
    });
  }

  if (user?.farmerProfile) {
    await prisma.farmerProfile.update({
      where: { userId },
      data: { averageRating: parseFloat(averageRating.toFixed(2)) }
    });
  }
}

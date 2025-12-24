import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, email, profileImage } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (profileImage) updateData.profileImage = profileImage;

    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: updateData,
      include: {
        workerProfile: true,
        farmerProfile: true
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    res.json({ message: 'Profile updated successfully', user: userWithoutPassword });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateWorkerProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.user.role !== 'WORKER') {
      return res.status(403).json({ error: 'Only workers can update worker profile' });
    }

    const {
      skills,
      languages,
      location,
      latitude,
      longitude,
      experienceYears,
      certifications
    } = req.body;

    const updateData: any = {};
    if (skills) updateData.skills = skills;
    if (languages) updateData.languages = languages;
    if (location) updateData.location = location;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;
    if (experienceYears !== undefined) updateData.experienceYears = experienceYears;
    if (certifications) updateData.certifications = certifications;

    const workerProfile = await prisma.workerProfile.update({
      where: { userId: req.user.userId },
      data: updateData
    });

    res.json({ message: 'Worker profile updated successfully', workerProfile });
  } catch (error: any) {
    console.error('Update worker profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateFarmerProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.user.role !== 'FARMER') {
      return res.status(403).json({ error: 'Only farmers can update farmer profile' });
    }

    const {
      farmName,
      farmLocation,
      latitude,
      longitude,
      farmSize,
      cropTypes
    } = req.body;

    const updateData: any = {};
    if (farmName) updateData.farmName = farmName;
    if (farmLocation) updateData.farmLocation = farmLocation;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;
    if (farmSize !== undefined) updateData.farmSize = farmSize;
    if (cropTypes) updateData.cropTypes = cropTypes;

    const farmerProfile = await prisma.farmerProfile.update({
      where: { userId: req.user.userId },
      data: updateData
    });

    res.json({ message: 'Farmer profile updated successfully', farmerProfile });
  } catch (error: any) {
    console.error('Update farmer profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        workerProfile: true,
        farmerProfile: true,
        receivedRatings: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword });
  } catch (error: any) {
    console.error('Get user by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

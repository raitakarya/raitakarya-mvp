import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.user.role !== 'FARMER') {
      return res.status(403).json({ error: 'Only farmers can create jobs' });
    }

    const {
      title,
      description,
      jobType,
      location,
      latitude,
      longitude,
      wagePerDay,
      duration,
      workersNeeded,
      requiredSkills,
      startDate
    } = req.body;

    if (!title || !description || !jobType || !location || !wagePerDay || !duration || !workersNeeded || !startDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const job = await prisma.job.create({
      data: {
        farmerId: req.user.userId,
        title,
        description,
        jobType,
        location,
        latitude,
        longitude,
        wagePerDay: parseFloat(wagePerDay),
        duration: parseInt(duration),
        workersNeeded: parseInt(workersNeeded),
        requiredSkills: requiredSkills || [],
        startDate: new Date(startDate),
        status: 'OPEN'
      },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            phone: true,
            farmerProfile: true
          }
        }
      }
    });

    await prisma.farmerProfile.update({
      where: { userId: req.user.userId },
      data: {
        totalJobsPosted: { increment: 1 }
      }
    });

    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error: any) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getJobs = async (req: AuthRequest, res: Response) => {
  try {
    const { status, jobType, location, page = '1', limit = '20' } = req.query;

    // Pagination parameters
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string))); // Max 100 per page
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (jobType) {
      where.jobType = jobType;
    }

    if (location) {
      where.location = {
        contains: location as string,
        mode: 'insensitive'
      };
    }

    // Get total count for pagination metadata
    const totalCount = await prisma.job.count({ where });

    const jobs = await prisma.job.findMany({
      where,
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            phone: true,
            farmerProfile: true
          }
        },
        applications: {
          include: {
            worker: {
              select: {
                id: true,
                name: true,
                phone: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limitNum
    });

    res.json({
      jobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
        hasMore: skip + jobs.length < totalCount
      }
    });
  } catch (error: any) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getJobById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            farmerProfile: true
          }
        },
        applications: {
          include: {
            worker: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                workerProfile: true
              }
            },
            payment: true
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ job });
  } catch (error: any) {
    console.error('Get job by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateJob = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.farmerId !== req.user.userId) {
      return res.status(403).json({ error: 'You can only update your own jobs' });
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: req.body,
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            phone: true,
            farmerProfile: true
          }
        }
      }
    });

    res.json({ message: 'Job updated successfully', job: updatedJob });
  } catch (error: any) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteJob = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.farmerId !== req.user.userId) {
      return res.status(403).json({ error: 'You can only delete your own jobs' });
    }

    await prisma.job.delete({
      where: { id }
    });

    res.json({ message: 'Job deleted successfully' });
  } catch (error: any) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyJobs = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.user.role !== 'FARMER') {
      return res.status(403).json({ error: 'Only farmers can view their jobs' });
    }

    const { page = '1', limit = '20' } = req.query;

    // Pagination parameters
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string))); // Max 100 per page
    const skip = (pageNum - 1) * limitNum;

    const where = { farmerId: req.user.userId };

    // Get total count for pagination metadata
    const totalCount = await prisma.job.count({ where });

    const jobs = await prisma.job.findMany({
      where,
      include: {
        applications: {
          include: {
            worker: {
              select: {
                id: true,
                name: true,
                phone: true,
                workerProfile: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limitNum
    });

    res.json({
      jobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
        hasMore: skip + jobs.length < totalCount
      }
    });
  } catch (error: any) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

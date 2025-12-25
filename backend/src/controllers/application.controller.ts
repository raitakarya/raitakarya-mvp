import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.user.role !== 'WORKER') {
      return res.status(403).json({ error: 'Only workers can apply to jobs' });
    }

    const { jobId, message } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status !== 'OPEN') {
      return res.status(400).json({ error: 'This job is no longer accepting applications' });
    }

    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_workerId: {
          jobId,
          workerId: req.user.userId
        }
      }
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied to this job' });
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        workerId: req.user.userId,
        message,
        status: 'PENDING'
      },
      include: {
        job: {
          include: {
            farmer: {
              select: {
                id: true,
                name: true,
                phone: true
              }
            }
          }
        },
        worker: {
          select: {
            id: true,
            name: true,
            phone: true,
            workerProfile: true
          }
        }
      }
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error: any) {
    console.error('Create application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.user.role !== 'WORKER') {
      return res.status(403).json({ error: 'Only workers can view their applications' });
    }

    const applications = await prisma.application.findMany({
      where: {
        workerId: req.user.userId
      },
      include: {
        job: {
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
        },
        payment: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ applications });
  } catch (error: any) {
    console.error('Get my applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['ACCEPTED', 'REJECTED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: true
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.job.farmerId !== req.user.userId) {
      return res.status(403).json({ error: 'You can only update applications for your own jobs' });
    }

    // CRITICAL: Use transaction to prevent race condition
    // Prevents over-accepting applications when multiple farmers accept simultaneously
    const updatedApplication = await prisma.$transaction(async (tx) => {
      // If accepting, check if job is already full
      if (status === 'ACCEPTED') {
        const acceptedCount = await tx.application.count({
          where: {
            jobId: application.jobId,
            status: 'ACCEPTED'
          }
        });

        if (acceptedCount >= application.job.workersNeeded) {
          throw new Error('Job is already full. Cannot accept more applications.');
        }
      }

      // Update the application status
      const updated = await tx.application.update({
        where: { id },
        data: { status },
        include: {
          job: true,
          worker: {
            select: {
              id: true,
              name: true,
              phone: true,
              workerProfile: true
            }
          },
          payment: true
        }
      });

      // If accepting and now at capacity, mark job as IN_PROGRESS
      if (status === 'ACCEPTED') {
        const newAcceptedCount = await tx.application.count({
          where: {
            jobId: application.jobId,
            status: 'ACCEPTED'
          }
        });

        if (newAcceptedCount >= application.job.workersNeeded) {
          await tx.job.update({
            where: { id: application.jobId },
            data: { status: 'IN_PROGRESS' }
          });
        }
      }

      return updated;
    });

    res.json({ message: 'Application status updated successfully', application: updatedApplication });
  } catch (error: any) {
    console.error('Update application status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
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
        },
        worker: {
          select: {
            id: true,
            name: true,
            phone: true,
            workerProfile: true
          }
        },
        payment: true
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.workerId !== req.user.userId && application.job.farmerId !== req.user.userId) {
      return res.status(403).json({ error: 'You do not have permission to view this application' });
    }

    res.json({ application });
  } catch (error: any) {
    console.error('Get application by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

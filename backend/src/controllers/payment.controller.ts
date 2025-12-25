import { Response } from 'express';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const createPayment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.user.role !== 'FARMER') {
      return res.status(403).json({ error: 'Only farmers can create payments' });
    }

    const { applicationId, amount } = req.body;

    if (!applicationId || !amount) {
      return res.status(400).json({ error: 'Application ID and amount are required' });
    }

    // Validate amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    if (parsedAmount > 1000000) {
      return res.status(400).json({ error: 'Amount cannot exceed ₹10,00,000' });
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: true,
        payment: true
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.job.farmerId !== req.user.userId) {
      return res.status(403).json({ error: 'You can only create payments for your own jobs' });
    }

    if (application.status !== 'ACCEPTED') {
      return res.status(400).json({ error: 'Can only create payment for accepted applications' });
    }

    if (application.payment) {
      return res.status(400).json({ error: 'Payment already exists for this application' });
    }

    // Verify amount matches job calculation
    const expectedAmount = application.job.wagePerDay * application.job.duration;
    if (Math.abs(parsedAmount - expectedAmount) > 0.01) {
      return res.status(400).json({
        error: `Amount mismatch. Expected ₹${expectedAmount} (₹${application.job.wagePerDay}/day × ${application.job.duration} days)`
      });
    }

    const payment = await prisma.payment.create({
      data: {
        applicationId,
        amount: parsedAmount,
        status: 'HELD_IN_ESCROW'
      },
      include: {
        application: {
          include: {
            job: true,
            worker: {
              select: {
                id: true,
                name: true,
                phone: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({ message: 'Payment created successfully', payment });
  } catch (error: any) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const releasePayment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.user.role !== 'FARMER') {
      return res.status(403).json({ error: 'Only farmers can release payments' });
    }

    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        application: {
          include: {
            job: true,
            worker: true
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.application.job.farmerId !== req.user.userId) {
      return res.status(403).json({ error: 'You can only release payments for your own jobs' });
    }

    if (payment.status !== 'HELD_IN_ESCROW') {
      return res.status(400).json({ error: 'Payment is not in escrow' });
    }

    // CRITICAL: Use transaction to ensure all-or-nothing payment release
    // If any step fails, entire operation rolls back
    const updatedPayment = await prisma.$transaction(async (tx) => {
      // 1. Update payment status to RELEASED
      const releasedPayment = await tx.payment.update({
        where: { id },
        data: {
          status: 'RELEASED',
          releasedAt: new Date()
        },
        include: {
          application: {
            include: {
              job: true,
              worker: {
                select: {
                  id: true,
                  name: true,
                  phone: true
                }
              }
            }
          }
        }
      });

      // 2. Mark application as COMPLETED
      await tx.application.update({
        where: { id: payment.applicationId },
        data: { status: 'COMPLETED' }
      });

      // 3. Update worker's earnings and job count
      await tx.workerProfile.update({
        where: { userId: payment.application.workerId },
        data: {
          totalEarnings: { increment: payment.amount },
          totalJobs: { increment: 1 }
        }
      });

      // 4. Update farmer's total spent
      await tx.farmerProfile.update({
        where: { userId: payment.application.job.farmerId },
        data: {
          totalSpent: { increment: payment.amount }
        }
      });

      return releasedPayment;
    });

    res.json({ message: 'Payment released successfully', payment: updatedPayment });
  } catch (error: any) {
    console.error('Release payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPaymentById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        application: {
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
                phone: true
              }
            }
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (
      payment.application.workerId !== req.user.userId &&
      payment.application.job.farmerId !== req.user.userId
    ) {
      return res.status(403).json({ error: 'You do not have permission to view this payment' });
    }

    res.json({ payment });
  } catch (error: any) {
    console.error('Get payment by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

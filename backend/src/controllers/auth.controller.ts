import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth.middleware';

export const signup = async (req: Request, res: Response) => {
  try {
    const {
      phone,
      name,
      email,
      password,
      role,
      profileImage,
      whatsappNumber,
      location,
      latitude,
      longitude,
      acceptedTerms
    } = req.body;

    // Basic field validation
    if (!phone || !name || !password || !role) {
      return res.status(400).json({ error: 'Phone, name, password, and role are required' });
    }

    if (!['WORKER', 'FARMER'].includes(role)) {
      return res.status(400).json({ error: 'Role must be WORKER or FARMER' });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Phone number basic validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit Indian phone number' });
    }

    // Email validation if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address' });
      }
    }

    // Check if user already exists with this phone or email
    const whereConditions: any[] = [{ phone }];
    if (email) {
      whereConditions.push({ email });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: whereConditions
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this phone or email' });
    }

    const hashedPassword = await hashPassword(password);

    // Use transaction to ensure atomicity - CRITICAL for data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          phone,
          name,
          email: email || null,
          password: hashedPassword,
          role,
          profileImage: profileImage || null,
          whatsappNumber: whatsappNumber || null,
          acceptedTermsAt: acceptedTerms ? new Date() : null
        }
      });

      // Create role-specific profile
      if (role === 'WORKER') {
        await tx.workerProfile.create({
          data: {
            userId: user.id,
            skills: [],
            languages: [],
            location: location || '',
            latitude: latitude || null,
            longitude: longitude || null,
            certifications: []
          }
        });
      } else if (role === 'FARMER') {
        await tx.farmerProfile.create({
          data: {
            userId: user.id,
            farmName: '',
            farmLocation: location || '',
            latitude: latitude || null,
            longitude: longitude || null,
            cropTypes: []
          }
        });
      }

      return user;
    });

    const token = generateToken({ userId: result.id, role: result.role });

    const { password: _, ...userWithoutPassword } = result;

    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword,
      token
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);

    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field';
      return res.status(400).json({
        error: `A user with this ${field} already exists. Please use a different ${field}.`
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { phone },
      include: {
        workerProfile: true,
        farmerProfile: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ userId: user.id, role: user.role });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        workerProfile: true,
        farmerProfile: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword });
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

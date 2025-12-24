import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth.middleware';

export const signup = async (req: Request, res: Response) => {
  try {
    const { phone, name, email, password, role } = req.body;

    if (!phone || !name || !password || !role) {
      return res.status(400).json({ error: 'Phone, name, password, and role are required' });
    }

    if (!['WORKER', 'FARMER'].includes(role)) {
      return res.status(400).json({ error: 'Role must be WORKER or FARMER' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone },
          email ? { email } : { phone: '' }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this phone or email' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        phone,
        name,
        email,
        password: hashedPassword,
        role
      }
    });

    if (role === 'WORKER') {
      await prisma.workerProfile.create({
        data: {
          userId: user.id,
          skills: [],
          languages: [],
          location: '',
          certifications: []
        }
      });
    } else if (role === 'FARMER') {
      await prisma.farmerProfile.create({
        data: {
          userId: user.id,
          farmName: '',
          farmLocation: '',
          cropTypes: []
        }
      });
    }

    const token = generateToken({ userId: user.id, role: user.role });

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword,
      token
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
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

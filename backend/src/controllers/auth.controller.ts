import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { db } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { generateAccessToken } from '../utils/generateToken';
import bcrypt from 'bcryptjs';
import { loginSchema, resetPasswordSchema } from '../validators/auth.validator';
import { logActivity } from '../services/notification.service';

export const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validated = loginSchema.parse(req.body);
    
    // Find user by email
    const user = await db.user.findUnique({
      where: { email: validated.email },
      include: { profile: true },
    });

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(validated.password, user.password);
    if (!isPasswordMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate Token
    const token = generateAccessToken(user.id, user.role);

    // Log Activity
    await logActivity(user.id, 'User Login', `Logged in successfully from IP ${req.ip}`, req.ip);

    res.status(200).json(
      new ApiResponse(200, {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          fullName: user.profile?.full_name || 'Admin',
        },
      }, 'Login successful')
    );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const user = await db.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json(
      new ApiResponse(200, {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      }, 'Current user retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const validated = resetPasswordSchema.parse(req.body);

    const user = await db.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Verify old password
    const isMatch = await bcrypt.compare(validated.oldPassword, user.password);
    if (!isMatch) {
      throw new ApiError(400, 'Invalid old password');
    }

    // Hash and update new password
    const hashedNewPassword = await bcrypt.hash(validated.newPassword, 10);
    await db.user.update({
      where: { id: req.user.id },
      data: { password: hashedNewPassword },
    });

    // Log Activity
    await logActivity(req.user.id, 'Password Reset', 'Changed password successfully', req.ip);

    res.status(200).json(
      new ApiResponse(200, null, 'Password updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

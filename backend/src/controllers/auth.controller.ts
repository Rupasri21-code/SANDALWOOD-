import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { db } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/generateToken';
import bcrypt from 'bcryptjs';
import { loginSchema, resetPasswordSchema } from '../validators/auth.validator';
import { logActivity } from '../services/notification.service';
import crypto from 'crypto';
import { sendEmail } from '../services/email.service';

export const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validated = loginSchema.parse(req.body);
    
    // Find user by email or username
    const user = await db.user.findFirst({
      where: { 
        OR: [
          { email: validated.identifier },
          { username: validated.identifier }
        ]
      },
      include: { profile: true },
    });

    if (!user) {
      throw new ApiError(401, 'Invalid email/username or password');
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(validated.password, user.password);
    if (!isPasswordMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate Access & Refresh Tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    // Log Activity
    await logActivity(user.id, 'User Login', `Logged in successfully from IP ${req.ip}`, req.ip);

    res.status(200).json(
      new ApiResponse(200, {
        accessToken,
        refreshToken,
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

export const refresh = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: incomingRefreshToken } = req.body;

    if (!incomingRefreshToken) {
      throw new ApiError(400, 'Refresh token is required');
    }

    try {
      const decoded = verifyRefreshToken(incomingRefreshToken);

      const user = await db.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        throw new ApiError(401, 'User associated with refresh token no longer exists');
      }

      // Generate new Access Token
      const accessToken = generateAccessToken(user.id, user.role);

      res.status(200).json(
        new ApiResponse(200, {
          accessToken,
        }, 'Token refreshed successfully')
      );
    } catch (err) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new ApiError(400, 'Email is required');
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError(404, 'User with this email does not exist');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await db.user.update({
      where: { id: user.id },
      data: {
        reset_password_token: resetToken,
        reset_password_expires: resetTokenExpiry,
      },
    });

    const baseUrl = process.env.FRONTEND_URL || process.env.ALLOWED_ORIGINS?.split(',')[0] || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    const message = `
      <h1>Password Reset Requested</h1>
      <p>You requested a password reset. Please click the link below to set a new password:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>This link is valid for 1 hour.</p>
    `;

    console.log(`🔑 [DEBUG] Password Reset Link for ${user.email}: ${resetUrl}`);

    try {
      const emailResult = await sendEmail(user.email, 'Chandhan Nilayam - Password Reset', message);

      if (!emailResult || !emailResult.success) {
        const errorMsg = emailResult?.error?.message || 'Email could not be sent';
        throw new ApiError(400, `Email sending failed: ${errorMsg}`);
      }

      res.status(200).json(new ApiResponse(200, null, 'Password reset email sent'));
    } catch (err) {
      // Check if it's a Resend sandbox restriction error (contains the registered owner email)
      const isSandboxError = err instanceof ApiError && err.message.includes('gopidesirupasri@gmail.com');

      if (!isSandboxError) {
        // Clean up token if email fails for other reasons
        await db.user.update({
          where: { id: user.id },
          data: {
            reset_password_token: null,
            reset_password_expires: null,
          },
        });
      }

      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(500, 'Email could not be sent');
    }
  } catch (error) {
    next(error);
  }
};

export const resetPasswordConfirm = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      throw new ApiError(400, 'Token and new password are required');
    }

    const user = await db.user.findFirst({
      where: {
        reset_password_token: token,
        reset_password_expires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new ApiError(400, 'Invalid or expired reset token');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        reset_password_token: null,
        reset_password_expires: null,
      },
    });

    res.status(200).json(new ApiResponse(200, null, 'Password has been successfully reset.'));
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

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Not authenticated');
    }

    const { full_name, phone } = req.body;
    
    // Check if user has an InvestorProfile
    const profile = await db.investorProfile.findUnique({
      where: { user_id: req.user.id }
    });
    
    if (profile) {
      await db.investorProfile.update({
        where: { user_id: req.user.id },
        data: { 
          full_name: full_name || profile.full_name, 
          phone: phone || profile.phone 
        }
      });
    } else {
      // Create profile for admin
      const user = await db.user.findUnique({ where: { id: req.user.id } });
      await db.investorProfile.create({
        data: {
          address_line1: req.body.address,
          user_id: req.user.id,
          first_name: 'Admin',
          last_name: 'Admin',
          email: user?.email || '',
          full_name: full_name || 'Admin',
          phone: phone || '',
          state: '',
          country: '',

          id_type: 'NONE',
          id_number: 'NONE',
          status: 'ACTIVE'
        }
      });
    }

    res.status(200).json(
      new ApiResponse(200, null, 'Profile updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

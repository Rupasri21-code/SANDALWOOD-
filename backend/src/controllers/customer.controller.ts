import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { createCustomerSchema, updateCustomerSchema } from '../validators/customer.validator';
import { sendCredentials } from '../services/email.service';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const listCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await db.customerProfile.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        landPlots: true,
        investments: true,
      },
    });

    res.status(200).json(
      new ApiResponse(200, customers, 'Customers retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const getCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const customer = await db.customerProfile.findUnique({
      where: { id },
      include: {
        landPlots: {
          include: { crops: true },
        },
        investments: {
          include: { payments: true },
        },
        payments: true,
        documents: true,
        media: true,
      },
    });

    if (!customer) {
      throw new ApiError(404, 'Customer profile not found');
    }

    res.status(200).json(
      new ApiResponse(200, customer, 'Customer profile retrieved')
    );
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validated = createCustomerSchema.parse(req.body);

    // Verify unique email
    const existing = await db.customerProfile.findUnique({
      where: { email: validated.email },
    });

    if (existing) {
      throw new ApiError(400, 'Customer email already registered');
    }

    const customer = await db.customerProfile.create({
      data: {
        full_name: validated.fullName,
        email: validated.email,
        phone: validated.phone,
        address: validated.address,
        city: validated.city,
        state: validated.state,
        country: validated.country,
        id_type: validated.idType,
        id_number: validated.idNumber,
        status: validated.status,
        notes: validated.notes,
      },
    });

    res.status(201).json(
      new ApiResponse(201, customer, 'Customer created successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validated = updateCustomerSchema.parse(req.body);

    const existing = await db.customerProfile.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Customer profile not found');
    }

    const updated = await db.customerProfile.update({
      where: { id },
      data: {
        full_name: validated.fullName,
        email: validated.email,
        phone: validated.phone,
        address: validated.address,
        city: validated.city,
        state: validated.state,
        country: validated.country,
        id_type: validated.idType,
        id_number: validated.idNumber,
        status: validated.status,
        notes: validated.notes,
      },
    });

    res.status(200).json(
      new ApiResponse(200, updated, 'Customer updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existing = await db.customerProfile.findUnique({ where: { id } });
    if (!existing) {
      throw new ApiError(404, 'Customer profile not found');
    }

    // Delete associated User as well if it exists
    if (existing.user_id) {
      await db.user.delete({ where: { id: existing.user_id } });
    } else {
      await db.customerProfile.delete({ where: { id } });
    }

    res.status(200).json(
      new ApiResponse(200, null, 'Customer deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

export const generatePortalCredentials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const customer = await db.customerProfile.findUnique({ where: { id } });
    if (!customer) {
      throw new ApiError(404, 'Customer profile not found');
    }

    if (customer.user_id) {
      throw new ApiError(400, 'Customer already has portal credentials');
    }

    // Generate random 10 character temporary password
    const tempPassword = crypto.randomBytes(5).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create User record
    const user = await db.user.create({
      data: {
        email: customer.email,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    });

    // Update Customer profile connection
    await db.customerProfile.update({
      where: { id },
      data: { user_id: user.id },
    });

    // Send credentials by email
    await sendCredentials(customer.email, customer.full_name, tempPassword);

    res.status(200).json(
      new ApiResponse(200, { email: customer.email, tempPassword }, 'Credentials generated and emailed successfully')
    );
  } catch (error) {
    next(error);
  }
};

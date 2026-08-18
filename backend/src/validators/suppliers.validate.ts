import { Role, Country, SupplierStatus } from '../generated/prisma/index.js';
import { z } from 'zod';

export const SupplierSchema = z.object({
  id: z.string().uuid(),
  companyName: z.string().min(1, 'Company name is required'),
  vatId: z.string().min(1, 'VAT ID is required'),
  country: z.nativeEnum(Country),
  contactEmail: z.string().email('Invalid contact email'),
  status: z.nativeEnum(SupplierStatus).default(SupplierStatus.DRAFT),

  createdById: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),

  approvedById: z.string().uuid().nullable().optional(),
  approvedAt: z.date().nullable().optional(),

  rejectedById: z.string().uuid().nullable().optional(),
  rejectedAt: z.date().nullable().optional(),
  rejectionReason: z.string().nullable().optional(),
});

// Schema for creating a supplier
export const CreateSupplierSchema = SupplierSchema.pick({
  companyName: true,
  vatId: true,
  country: true,
  contactEmail: true,
  createdById: true,
});

// Schema for updating a supplier:
// vatId is REQUIRED (to identify the record), other editable fields are OPTIONAL
export const UpdateSupplierSchema = z.object({
  vatId: z.string().min(1, 'VAT ID is required'),
  companyName: z.string().min(1, 'Company name cannot be empty').optional(),
  country: z.nativeEnum(Country).optional(),
  contactEmail: z.string().email('Invalid contact email').optional(),
});

// Schema for Approving a supplier
export const ApproveSupplierSchema = z.object({
  supplierId: z.string().uuid('Invalid supplier ID'),
});

// Schema for Rejecting a supplier
export const RejectSupplierSchema = z.object({
  supplierId: z.string().uuid('Invalid supplier ID'),
  rejectionReason: z
    .string({
      error: 'Rejection reason is required',
    })
    .trim()
    .min(10, 'Rejection reason must be at least 10 characters long')
    .max(500, 'Rejection reason cannot exceed 500 characters'),
});

// Inferred TypeScript Types
export type SupplierInput = z.infer<typeof CreateSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof UpdateSupplierSchema>;
export type ApproveSupplierInput = z.infer<typeof ApproveSupplierSchema>;
export type RejectSupplierInput = z.infer<typeof RejectSupplierSchema>;
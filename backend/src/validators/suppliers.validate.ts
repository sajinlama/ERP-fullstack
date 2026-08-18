import { Role,Country,SupplierStatus } from '../generated/prisma/index.js';
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

// Schema for creating a new Supplier (typically in DRAFT state)
export const CreateSupplierSchema = SupplierSchema.pick({
  companyName: true,
  vatId: true,
  country: true,
  contactEmail: true,
  createdById: true,
});

// Schema for approving a Supplier
export const ApproveSupplierSchema = z.object({
  approvedById: z.string().uuid(),
});



// Schema for rejecting a Supplier
export const RejectSupplierSchema = z.object({
  rejectedById: z.string().uuid(),
  rejectionReason: z.string().min(3, 'Rejection reason must be provided'),
});

export type SupplierInput = z.infer<typeof CreateSupplierSchema>;
export type ApproveSupplierInput = z.infer<typeof ApproveSupplierSchema>;
export type RejectSupplierInput = z.infer<typeof RejectSupplierSchema>;
import prisma from "../../config/prisma.js";
import { SupplierStatus } from "../../generated/prisma/index.js";
import ApiError from "../../utils/api.js";



export const approveSupplierService = async (
  supplierId: string,
  approverId: string
) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
  });

  if (!supplier) {
    throw new ApiError(404, "Supplier not found");
  }

  if (supplier.status === SupplierStatus.APPROVED) {
    throw new ApiError(400, "Supplier is already approved");
  }

  // Clear any past rejection metadata if re-approved
  const updatedSupplier = await prisma.supplier.update({
    where: { id: supplierId },
    data: {
      status: SupplierStatus.APPROVED,
      approvedById: approverId,
      approvedAt: new Date(),
      rejectedById: null,
      rejectedAt: null,
      rejectionReason: null,
    },
    include: {
      approvedBy: {
        select: { id: true, name: true, email: true },
      },
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return updatedSupplier;
};
export const rejectSupplierService = async (
  supplierId: string,
  approverId: string,
  rejectionReason: string
) => {
  // 1. Verify supplier existence
  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
  });

  if (!supplier) {
    throw new ApiError(404, "Supplier not found");
  }

  // 2. Prevent redundant rejections
  if (supplier.status === SupplierStatus.REJECTED) {
    throw new ApiError(400, "Supplier is already rejected");
  }

  // 3. Update database record with reason and reviewer info
  const updatedSupplier = await prisma.supplier.update({
    where: { id: supplierId },
    data: {
      status: SupplierStatus.REJECTED,
      rejectionReason,
      rejectedById: approverId,
      rejectedAt: new Date(),
      approvedById: null,
      approvedAt: null,
    },
    include: {
      rejectedBy: {
        select: { id: true, name: true, email: true },
      },
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return updatedSupplier;
};
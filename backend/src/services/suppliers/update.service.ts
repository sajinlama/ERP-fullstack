import prisma from "../../config/prisma.js";
import ApiError from "../../utils/api.js";
import { SupplierStatus } from "../../generated/prisma/index.js";
import type { UpdateSupplierInput } from "../../validators/suppliers.validate.js";

export const updateSupplier = async (validData: UpdateSupplierInput) => {
  const { vatId, ...updatePayload } = validData;

  const existingSupplier = await prisma.supplier.findUnique({
    where: { vatId },
  });

  if (!existingSupplier) {
    throw new ApiError(404, `Supplier with VAT ID '${vatId}' not found`);
  }

  if (existingSupplier.status === SupplierStatus.APPROVED) {
    throw new ApiError(400, "Approved suppliers cannot be edited directly");
  }

  const cleanUpdatePayload = Object.fromEntries(
    Object.entries(updatePayload).filter(([_, value]) => value !== undefined)
  );

  const updatedSupplier = await prisma.supplier.update({
    where: { vatId },
    data: {
      ...cleanUpdatePayload,
      status: SupplierStatus.PENDING_APPROVAL,
      rejectedById: null,
      rejectedAt: null,
      rejectionReason: null,
    },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return updatedSupplier;
};

export default updateSupplier;
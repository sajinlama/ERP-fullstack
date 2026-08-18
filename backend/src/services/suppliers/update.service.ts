import prisma from "../../config/prisma.js";
import ApiError from "../../utils/api.js";
import type { SupplierInput } from "../../validators/suppliers.validate.js";

// If you have a partial type for updates, use that; otherwise pass the fields to update
export const updateSupplier = async (validData: Partial<SupplierInput> & { vatId: string }) => {
  const { vatId, ...updatePayload } = validData;

  const existingSupplier = await prisma.supplier.findUnique({
    where: { vatId },
  });

  if (!existingSupplier) {
    throw new ApiError(404, "Supplier not found with the provided VAT ID");
  }

  // 2. Perform the update
  const updatedSupplier = await prisma.supplier.update({
    where: { vatId },
    data: updatePayload,
  });

  return updatedSupplier;
};

export default updateSupplier;
import prisma from "../../config/prisma.js";
import ApiError from "../../utils/api.js";
import type { SupplierInput } from "../../validators/suppliers.validate.js";

export const createSupplier = async (validateData: SupplierInput) => {
  const { vatId, companyName, contactEmail, country, createdById } = validateData;

  const existingSupplier = await prisma.supplier.findUnique({
    where: { vatId },
  });

  if (existingSupplier) {
    throw new ApiError(409, "A supplier with this VAT ID already exists");
  }

  // 2. Persist new supplier in the database
  const newSupplier = await prisma.supplier.create({
    data: {
      vatId,
      companyName,
      contactEmail,
      country,
      createdById,
    },
  });

  return newSupplier;
};
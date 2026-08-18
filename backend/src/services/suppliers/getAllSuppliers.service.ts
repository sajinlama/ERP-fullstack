import prisma from "../../config/prisma.js";

export const getAllSuppliers = async () => {
  const suppliers = await prisma.supplier.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
      approvedBy: {
        select: { id: true, name: true, email: true },
      },
      rejectedBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return suppliers;
};

export default getAllSuppliers;
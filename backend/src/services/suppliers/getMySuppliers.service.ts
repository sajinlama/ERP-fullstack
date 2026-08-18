import prisma from "../../config/prisma.js";

export const getMySuppliers = async (createdById: string) => {
  return await prisma.supplier.findMany({
    where: { createdById },
    orderBy: { createdAt: "desc" },
    include: {
      approvedBy: { select: { name: true, email: true } },
      rejectedBy: { select: { name: true, email: true } },
    },
  });
};
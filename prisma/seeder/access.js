const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const ACCESS = [
  {
    id: 1,
    visible: true,
    grant: { create: true, update: true, read: true, delete: true, },
    role_id: 2,
    menu_id: 1,
    createdBy: "Super Duper Admin"
  },
];

async function accessSeed() {
  const access = await prisma.access.findMany();
  if(access.length) return;
  await prisma.access.deleteMany();
  return await prisma.access.createMany({
    data: ACCESS,
  });
}

module.exports = accessSeed;

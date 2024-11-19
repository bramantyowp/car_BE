const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ROLE = [
  {
    id: 1,
    role: "SUPERADMIN",
    createdBy: "Super Duper Admin"
  },
  {
    id: 2,
    role: "ADMIN",
    createdBy: "Super Duper Admin"
  },
  {
    id: 3,
    role: "USER",
    createdBy: "Super Duper Admin"
  },
];

async function roleSeed() {
  const role = await prisma.roles.findMany();
  if(role.length) return;
  await prisma.roles.deleteMany()
  return await prisma.roles.createMany({
    data: ROLE,
  });
}

module.exports = roleSeed;

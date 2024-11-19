const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const MENUS = [
  {
    id: 1,
    name: "CARS",
    title: "Cars",          
    icon: null,           
    path: '/cars',           
    is_submenu: false,   
    permissions: ['create', 'update', 'read', 
      'delete', 'import', 'export'],   
    createdBy: "Super Duper Admin"
  },
];

async function menuSeed() {
  const menu = await prisma.menus.findMany();
  if(menu.length) return;
  await prisma.menus.deleteMany()
  return await prisma.menus.createMany({
    data: MENUS,
  });
}

module.exports = menuSeed

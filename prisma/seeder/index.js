const { PrismaClient } = require("@prisma/client");

const roleSeed = require('./role')
const userSeed = require('./user')
const menuSeed = require('./menu')
const accessSeed = require('./access')

const prisma = new PrismaClient();

async function main() {
  try{
    const role = await roleSeed()
    const menu = await menuSeed()
    const user = await userSeed()
    const access = await accessSeed()
    console.log(`Database has been seeded. 🌱`);
  } catch(e) {
    console.log(e)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

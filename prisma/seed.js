require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin@123456', 10)

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      name: 'Admin',
      passwordHash,
    },
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      passwordHash,
      role: 'ADMIN',
    },
  })

  console.log('Seed completed: admin@example.com / Admin@123456')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
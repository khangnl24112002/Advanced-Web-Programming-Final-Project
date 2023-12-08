import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.roles.createMany({
    data: [
      {
        id: 3,
        name: 'student',
      },
      {
        id: 4,
        name: 'teacher',
      },
      {
        id: 1,
        name: 'admin',
      },
      {
        id: 2,
        name: 'user',
      },
    ],
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

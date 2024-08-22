const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function insertThing() {
  const holamundos = [
    { message: 'Hola' },];

  for (const holamundo of holamundos) {
    await prisma.holamundo.create({
      data: {
        message: holamundo.message,
      },
    });
    console.log(`Nuevo ${holamundo.message} insertado`);
  }
}

insertThing()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

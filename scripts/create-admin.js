const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@gfsm.com'; // Cambiar por el email deseado
  const password = 'password123'; // Cambiar por una contraseña segura
  const name = 'Administrador GFSM';

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      name
    },
    create: {
      email,
      password: hashedPassword,
      name
    }
  });

  console.log('✅ Administrador creado/actualizado:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

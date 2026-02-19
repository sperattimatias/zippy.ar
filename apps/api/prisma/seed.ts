import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const USERS = [
  { email: 'admin@zippy.ar', password: 'Admin123!', role: Role.ADMIN },
  { email: 'driver@zippy.ar', password: 'Driver123!', role: Role.DRIVER },
  { email: 'passenger@zippy.ar', password: 'Passenger123!', role: Role.PASSENGER }
] as const;

async function seed() {
  for (const user of USERS) {
    const passwordHash = await bcrypt.hash(user.password, 12);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        role: user.role,
        passwordHash
      },
      create: {
        email: user.email,
        role: user.role,
        passwordHash
      }
    });

    console.log(`✅ seeded ${user.role}: ${user.email}`);
  }
}

seed()
  .catch((error) => {
    console.error('❌ db seed failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

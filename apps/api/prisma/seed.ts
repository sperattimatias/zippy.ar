import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

const prisma = new PrismaClient();

const defaultPricing = {
  baseFareAuto: 1500,
  baseFareMoto: 1000,
  perKmAuto: 500,
  perKmMoto: 350,
  perMinAuto: 120,
  perMinMoto: 90,
  multiplierDirect: 1.15,
  multiplierShared: 0.9,
  surchargeLuggage: 400,
  surchargePet: 350,
  surchargeAccessibility: 500,
  minFare: 1200,
  maxSearchRadiusKm: 5
};

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@zippy.com.ar';
  const generatedPassword = crypto.randomBytes(9).toString('base64url');
  const adminPassword = process.env.ADMIN_PASSWORD ?? generatedPassword;

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: Role.ADMIN,
      firstName: 'Super',
      lastName: 'Admin',
      passwordHash: await bcrypt.hash(adminPassword, 12)
    },
    create: {
      email: adminEmail,
      role: Role.ADMIN,
      firstName: 'Super',
      lastName: 'Admin',
      avatarUrl: '/uploads/default-admin.png',
      passwordHash: await bcrypt.hash(adminPassword, 12)
    }
  });

  console.log(`✅ superadmin ready: ${admin.email}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.log(`🔐 generated admin password: ${adminPassword}`);
  }
}

async function seedConfig() {
  await prisma.appConfig.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      pricing: defaultPricing
    }
  });

  console.log('✅ app config ready');
}

async function seed() {
  await seedAdmin();
  await seedConfig();
}

seed()
  .catch((error) => {
    console.error('❌ db seed failed', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

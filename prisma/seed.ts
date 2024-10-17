import bcrypt from 'bcryptjs';
import { db } from '../lib/database/db';

async function main() {
  // Create departments
  const mechanical = await db.department.upsert({
    where: { name: 'Mechanical Engineering' },
    update: { name: 'Mechanical Engineering' },
    create: {
      name: 'Mechanical Engineering',
    },
  });
  const civil = await db.department.upsert({
    where: { name: 'Civil Engineering' },
    update: { name: 'Civil Engineering' },
    create: {
      name: 'Civil Engineering',
    },
  });
  const hospitality = await db.department.upsert({
    where: { name: 'Hospitality Management' },
    update: { name: 'Hospitality Management' },
    create: {
      name: 'Hospitality Management',
    },
  });
  const ICT = await db.department.upsert({
    where: { name: 'ICT' },
    update: { name: 'ICT' },
    create: {
      name: 'ICT',
    },
  });

  const hashedPassword = await bcrypt.hash('Official@2024', 10);

  // Create users and trainers
  const das = await db.user.upsert({
    where: { email: 'ngomadas.rp@gmail.com' },
    update: {
      name: 'Ngoma DAS',
      email: 'ngomadas.rp@gmail.com',
      phoneNumber: '0787654321',
      password: hashedPassword,
      role: 'DAS',
      onboarded: true,
      emailVerified: new Date(),
    },
    create: {
      name: 'Ngoma DAS',
      email: 'ngomadas.rp@gmail.com',
      phoneNumber: '0787654321',
      password: hashedPassword,
      role: 'DAS',
      onboarded: true,
      emailVerified: new Date(),
    },
  });

  const user1 = await db.user.upsert({
    where: { email: 'john@gmail.com' },
    update: {
      name: 'John Smith',
      email: 'john@gmail.com',
      phoneNumber: '0783456789',
      password: hashedPassword,
      role: 'HOD',
      onboarded: true,
      emailVerified: new Date(),
    },
    create: {
      name: 'John Smith',
      email: 'john@gmail.com',
      phoneNumber: '0783456789',
      password: hashedPassword,
      role: 'HOD',
      onboarded: true,
      emailVerified: new Date(),
    },
  });

  const trainer1 = await db.trainer.upsert({
    where: { userId: user1.id },
    update: { userId: user1.id, departmentId: ICT.id },
    create: {
      userId: user1.id,
      departmentId: ICT.id,
    },
  });

  const user2 = await db.user.upsert({
    where: { email: 'alice@gmail.com' },
    update: {
      name: 'Alice Smith',
      email: 'alice@gmail.com',
      phoneNumber: '987654321',
      password: hashedPassword,
      role: 'TRAINER',
      onboarded: true,
      emailVerified: new Date(),
    },
    create: {
      name: 'Alice Smith',
      email: 'alice@gmail.com',
      phoneNumber: '987654321',
      password: hashedPassword,
      role: 'TRAINER',
      onboarded: true,
      emailVerified: new Date(),
    },
  });

  const trainer2 = await db.trainer.upsert({
    where: { userId: user2.id },
    update: { userId: user2.id, departmentId: ICT.id },
    create: {
      userId: user2.id,
      departmentId: ICT.id,
    },
  });

  const user3 = await db.user.upsert({
    where: { email: 'jane@gmail.com' },
    update: {
      name: 'Jane Smith',
      email: 'jane@gmail.com',
      phoneNumber: '0789654321',
      password: hashedPassword,
      role: 'TRAINER',
      onboarded: true,
      emailVerified: new Date(),
    },
    create: {
      name: 'Jane Smith',
      email: 'jane@gmail.com',
      phoneNumber: '0789654321',
      password: hashedPassword,
      role: 'TRAINER',
      onboarded: true,
      emailVerified: new Date(),
    },
  });

  const trainer3 = await db.trainer.upsert({
    where: { userId: user3.id },
    update: { userId: user3.id, departmentId: civil.id },
    create: {
      userId: user3.id,
      departmentId: civil.id,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

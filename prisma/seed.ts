import bcrypt from 'bcryptjs';
import { db } from '../lib/database/db';

async function main() {
  // Create departments
  const department = await db.department.upsert({
    where: { name: 'Computer Science' },
    update: { name: 'Computer Science' },
    create: {
      name: 'Computer Science',
    },
  });
  const department1 = await db.department.upsert({
    where: { name: 'Computer Science' },
    update: { name: 'Computer Science' },
    create: {
      name: 'Multimedia',
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
    update: { userId: user1.id, departmentId: department.id },
    create: {
      userId: user1.id,
      departmentId: department.id,
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
    update: { userId: user2.id, departmentId: department.id },
    create: {
      userId: user2.id,
      departmentId: department.id,
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
    update: { userId: user3.id, departmentId: department1.id },
    create: {
      userId: user3.id,
      departmentId: department1.id,
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

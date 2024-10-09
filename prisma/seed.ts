import { Day, PrismaClient, UserSex } from '@prisma/client';

import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Official@2024', 10);

  // Seed 10 Users
  const users = await prisma.user.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phoneNumber: `078910430${i - 1}`,
      address: `Address ${i + 1}`,
      sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
      password: hashedPassword,
      role: i % 2 === 0 ? 'STUDENT' : 'TRAINER',
      birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
      emailVerified: new Date(),
    })),
  });

  // Fetch the created users
  const createdSt = await prisma.user.findMany({
    where: { role: 'STUDENT' }, // Only select student users
  });
  const createduTr = await prisma.user.findMany({
    where: { role: 'TRAINER' }, // Only select student users
  });

  // Seed 10 Departments
  const departments = await prisma.department.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      name: `Department ${i + 1}`,
    })),
  });

  // Fetch the created department
  const createdDepartments = await prisma.department.findMany();

  // Seed 10 Rooms with valid gradeId references
  const rooms = await prisma.room.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      name: `Room ${i + 1}`, // Unique room names
      capacity: Math.floor(Math.random() * 50) + 20, // Random capacity between 20 and 70
    })),
  });

  // Fetch the created room
  const createdRooms = await prisma.room.findMany();

  // Seed 10 Students with valid userId references
  const students = await prisma.student.createMany({
    data: Array.from({ length: 5 }).map((_, i) => ({
      userId: createdSt[i].id, // Assign userId from the created users
      departmentId: createdDepartments[i % createdDepartments.length].id, // Ensure valid departmentId
      roomId: createdRooms[i % createdRooms.length].id, // Ensure valid roomId
    })),
  });

  // Fetch the created students
  const createdStudents = await prisma.student.findMany();

  // Seed 10 Trainers
  const trainers = await prisma.trainer.createMany({
    data: Array.from({ length: 5 }).map((_, i) => ({
      userId: createduTr[i].id, // Assign userId from the created users
      departmentId: createdDepartments[i % createdDepartments.length].id, // Ensure valid departmentId
    })),
  });

  // Fetch the created modules
  const createdTrainers = await prisma.trainer.findMany();

  // Seed 10 Modules
  const modules = await prisma.module.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      name: `Module ${i + 1}`,
      code: `MOD${i + 1}`,
      level: ((i % 3) + 1).toString(), // Level 1 to 3
    })),
  });

  // Fetch the created modules
  const createdModules = await prisma.module.findMany();

  // Seed 10 Lessons
  const lessons = await prisma.lesson.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      name: `Lesson ${i + 1}`,
      moduleId: createdModules[i % createdModules.length].id, // Assign valid moduleId
      trainerId: createdTrainers[i % createdTrainers.length].id, // Ensure valid trainerId
    })),
  });

  // Fetch created lessons
  const createdLessons = await prisma.lesson.findMany();

  // Seed 10 Lessons
  const timeSlot = await prisma.timeSlot.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      day: Day[
        Object.keys(Day)[
          Math.floor(Math.random() * Object.keys(Day).length)
        ] as keyof typeof Day
      ],
      startTime: new Date(
        new Date().setHours(new Date().getHours() + (i + 1) * 1)
      ),
      endTime: new Date(
        new Date().setHours(new Date().getHours() + (i + 1) * 1 + 3)
      ),
    })),
  });

  // Fetch created timeSlots
  const createdTimeSlot = await prisma.timeSlot.findMany();

  // Seed 10 Lessons
  const timeTableEntry = await prisma.timetableEntry.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      lessonId: createdLessons[i % createdLessons.length].id,
      roomId: createdRooms[i % createdRooms.length].id,
      timeSlotId: createdTimeSlot[i % createdTimeSlot.length].id,
    })),
  });

  // Fetch created lessons
  const createdTimeTableEntry = await prisma.lesson.findMany();
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

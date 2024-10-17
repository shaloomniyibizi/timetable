import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TimetableEntry {
  lessonId: string;
  roomId: string;
  day: string;
  startTime: Date;
  endTime: Date;
}

interface TimeSlot {
  startTime: Date;
  endTime: Date;
}

async function generateWeeklyTimetableWithTimeRanges(): Promise<void> {
  // Define working days (Monday to Friday)
  const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  // Fetch all lessons and rooms
  const lessons = await prisma.lesson.findMany();
  const rooms = await prisma.room.findMany();

  // Initialize timetable structure
  const timetable: TimetableEntry[] = [];

  // Track occupied time slots for each room on each day
  const occupiedTimeSlots: Record<string, Record<string, TimeSlot[]>> = {};

  // Function to check if a room is available during a specific time range on a day
  function isRoomAvailable(
    roomId: string,
    day: string,
    startTime: Date,
    endTime: Date
  ): boolean {
    const daySlots = occupiedTimeSlots[day]?.[roomId] || [];
    return !daySlots.some(
      (slot) => startTime < slot.endTime && endTime > slot.startTime
    );
  }

  // Allocate lessons to rooms across working days
  for (const day of workingDays) {
    occupiedTimeSlots[day] = {};

    for (const lesson of lessons) {
      for (const room of rooms) {
        // Parse lesson's start and end times
        const startTime = new Date(lesson.startTime);
        const endTime = new Date(lesson.endTime);

        // Check if the room is free during the lesson's time range
        if (isRoomAvailable(room.id, day, startTime, endTime)) {
          // Assign lesson to this room on this day
          timetable.push({
            lessonId: lesson.id,
            roomId: room.id,
            startTime: startTime,
            endTime: endTime,
            day: day,
          });

          // Mark this time slot as occupied
          if (!occupiedTimeSlots[day][room.id]) {
            occupiedTimeSlots[day][room.id] = [];
          }
          occupiedTimeSlots[day][room.id].push({ startTime, endTime });
          break; // Move to the next lesson after assignment
        }
      }
    }
  }

  // Insert timetable entries into the database
  for (const entry of timetable) {
    await prisma.timetableEntry.create({
      data: {
        lessonId: entry.lessonId,
        roomId: entry.roomId,
        day: entry.day,
        startTime: entry.startTime,
        endTime: entry.endTime,
      },
    });
  }

  console.log(
    'Weekly timetable with variable time ranges generated successfully!'
  );
}

// Run the timetable generation function
generateWeeklyTimetableWithTimeRanges();

'use server';

import { db } from '../database/db';

interface Timetable {
  lessonId: number;
  roomId: number;
  timeSlotId: number;
}

export async function generateTimetable() {
  // Fetch lessons, rooms, and timeslots
  const lessons = await db.lesson.findMany();
  const rooms = await db.room.findMany();
  const timeSlots = await db.timeSlot.findMany();

  const timetable: Timetable[] = [];

  // Ensure no room or timeslot is double booked
  const occupiedTimeSlots: Record<number, Set<number>> = {};

  for (const lesson of lessons) {
    for (const room of rooms) {
      for (const timeSlot of timeSlots) {
        // Check if this room is free at this timeslot
        if (!occupiedTimeSlots[room.id]) {
          occupiedTimeSlots[room.id] = new Set();
        }

        if (!occupiedTimeSlots[room.id].has(timeSlot.id)) {
          // Assign this lesson to the free room and timeslot
          timetable.push({
            lessonId: lesson.id,
            roomId: room.id,
            timeSlotId: timeSlot.id,
          });

          // Mark this room and timeslot as occupied
          occupiedTimeSlots[room.id].add(timeSlot.id);
          break; // Move to the next lesson after assigning
        }
      }
    }
  }

  // Save the generated timetable to the database
  for (const entry of timetable) {
    await db.timetableEntry.create({
      data: {
        lessonId: entry.lessonId,
        roomId: entry.roomId,
        timeSlotId: entry.timeSlotId,
      },
    });
  }

  console.log('Timetable generated successfully!');
}

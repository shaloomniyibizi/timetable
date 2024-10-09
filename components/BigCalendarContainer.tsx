import { db } from '@/lib/database/db';
import { adjustScheduleToCurrentWeek } from '@/lib/utils';
import BigCalendar from './BigCalender';

const BigCalendarContainer = async () => {
  const dataRes = await db.timetableEntry.findMany({
    include: {
      lesson: true,
      room: true,
      timeSlot: true,
    },
  });

  const data = dataRes.map((datas) => ({
    title: datas.lesson.name,
    start: datas.timeSlot.startTime,
    end: datas.timeSlot.endTime,
  }));

  const schedule = adjustScheduleToCurrentWeek(data);

  return (
    <div className=''>
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;

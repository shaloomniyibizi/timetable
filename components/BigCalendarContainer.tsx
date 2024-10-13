import { db } from '@/lib/database/db';
import { adjustScheduleToCurrentWeek } from '@/lib/utils';
import BigCalendar from './BigCalender';

const BigCalendarContainer = async () => {
  const dataRes = await db.lesson.findMany({
    include: {
      trainer: true,
      module: true,
    },
  });

  const data = dataRes.map((datas) => ({
    title: datas.module.name,
    day: datas.day,
    start: datas.startTime,
    end: datas.endTime,
  }));

  const schedule = adjustScheduleToCurrentWeek(data);

  return (
    <div className=''>
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;

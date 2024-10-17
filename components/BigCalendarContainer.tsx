import { getTrainerByUserId } from '@/lib/actions/trainer.action';
import { db } from '@/lib/database/db';
import { currentUser } from '@/lib/user.auth';
import { adjustScheduleToCurrentWeek } from '@/lib/utils';
import BigCalendar from './BigCalender';

const BigCalendarContainer = async () => {
  const user = await currentUser();
  const trainer = await getTrainerByUserId(user?.id!);
  const dataRes = await db.lesson.findMany({
    where: { trainerId: trainer?.id },
    include: {
      trainer: true,
      module: true,
      room: true,
    },
  });

  const data = dataRes.map((datas) => ({
    title: `${datas.module.name}  ${datas.room.name}`,
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

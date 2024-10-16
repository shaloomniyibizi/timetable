import BigCalendarContainer from '@/components/BigCalendarContainer';

const TimeTablePage = async () => {
  return (
    <div className='flex-1 p-4 flex gap-4 flex-col xl:flex-row'>
      <div className='w-full xl:w-2/3'>
        <div className='h-full bg-background p-4 rounded-md'>
          <h1 className='text-xl font-semibold'>Schedule</h1>
          <BigCalendarContainer />
        </div>
      </div>
    </div>
  );
};

export default TimeTablePage;

import EditRoomForm from '@/components/room/EditRoomForm';
import { getRoomById } from '@/lib/actions/room.action';

const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return 'no such user';
  const room = await getRoomById(params.id);
  return (
    <div className='mx-auto w-full max-w-5xl overflow-x-clip'>
      <EditRoomForm room={room!} />
    </div>
  );
};

export default page;

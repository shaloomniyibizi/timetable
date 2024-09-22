import EditTrainerForm from '@/components/trainer/EditTrainerForm';
import { getTrainerById } from '@/lib/actions/trainer.action';
import { getUserById } from '@/lib/data/user';

const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return 'no such user';
  const trainer = await getTrainerById(params.id);
  const user = await getUserById(trainer?.userId!);
  return (
    <div className='mx-auto w-full max-w-5xl overflow-x-clip'>
      <EditTrainerForm user={user!} />
    </div>
  );
};

export default page;

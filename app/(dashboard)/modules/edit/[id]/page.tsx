import EditModuleForm from '@/components/module/EditModuleForm';
import { getModuleById } from '@/lib/actions/module.action';

const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return 'no such user';
  const module = await getModuleById(params.id);
  return (
    <div className='mx-auto w-full max-w-5xl overflow-x-clip'>
      <EditModuleForm module={module!} />
    </div>
  );
};

export default page;

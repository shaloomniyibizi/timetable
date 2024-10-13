import EditLessonForm from '@/components/lesson/EditLessonForm';
import { getLessonById } from '@/lib/actions/lesson.action';

const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return 'no such user';
  const lesson = await getLessonById(params.id);
  return (
    <div className='mx-auto w-full max-w-5xl overflow-x-clip'>
      <EditLessonForm lesson={lesson!} />
    </div>
  );
};

export default page;

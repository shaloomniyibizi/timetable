import { redirect } from 'next/navigation';

function EditPage() {
  return <div>{redirect('/trainers')}</div>;
}

export default EditPage;

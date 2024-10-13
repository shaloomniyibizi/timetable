import { redirect } from 'next/navigation';

function EditPage() {
  return <div>{redirect('/lessons')}</div>;
}

export default EditPage;

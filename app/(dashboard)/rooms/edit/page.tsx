import { redirect } from 'next/navigation';

function EditPage() {
  return <div>{redirect('/rooms')}</div>;
}

export default EditPage;

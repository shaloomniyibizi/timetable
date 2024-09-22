import { redirect } from 'next/navigation';

import { getUserById } from '@/lib/data/user';
import { currentUser } from '@/lib/user.auth';
import Settings from './_components/Settings';

async function SettingsPage() {
  const user = await currentUser();
  if (!user) redirect('/login');
  const dbUser = await getUserById(user.id!);
  return <Settings user={dbUser!} />;
}

export default SettingsPage;

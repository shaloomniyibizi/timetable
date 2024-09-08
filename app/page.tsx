import { Button } from '@/components/ui/button';
import { currentUser } from '@/lib/user.auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await currentUser();

  if (!user) redirect('/auth/login');
  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
}

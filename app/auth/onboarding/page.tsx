import { getUserById } from '@/lib/data/user';
import { currentUser } from '@/lib/user.auth';
import { redirect } from 'next/navigation';
import OnboardingForm from './_components/OnboardingForm';
async function OnboardingPage() {
  const user = await currentUser();
  if (!user) redirect('/login');
  const dbUser = await getUserById(user.id!);
  if (dbUser?.onboarded) redirect('/');
  return (
    <div className='mx-auto mt-4 w-full max-w-3xl'>
      <OnboardingForm user={dbUser!} />
    </div>
  );
}

export default OnboardingPage;

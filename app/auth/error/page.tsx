import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

const AuthErrorPage = () => {
  return (
    <div className='flex min-h-screen w-full items-center justify-center'>
      Opps!! samething went wrong
      <ExclamationTriangleIcon className='text-destructive' />
    </div>
  );
};

export default AuthErrorPage;

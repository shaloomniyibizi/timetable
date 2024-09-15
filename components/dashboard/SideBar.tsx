import { Bell, Package2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { SideBarMenu } from '@/lib/constants';
import { cn } from '@/lib/utils';

const SideBar = () => {
  const isActive = false;
  return (
    <div className='flex h-full max-h-screen flex-col gap-2'>
      <div className='flex h-14 w-full items-center border-b px-4 lg:h-[60px] lg:px-6'>
        <Link href='/' className='flex items-center gap-2 font-semibold'>
          <Package2 className='h-6 w-6' />
          <span className=''>Time Table</span>
        </Link>
        <Button variant='outline' size='icon' className='ml-auto h-8 w-8'>
          <Bell className='h-4 w-4' />
          <span className='sr-only'>Toggle notifications</span>
        </Button>
      </div>
      <div className='flex-1'>
        <nav className='grid gap-2 items-start px-2 text-sm font-medium lg:px-4'>
          {SideBarMenu.map((menu, i) => (
            <Link
              key={i}
              href={menu.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                isActive && 'bg-muted'
              )}
            >
              {menu.icon}
              {menu.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className='mt-auto p-4'>
        <Button className='w-full'>User</Button>
      </div>
    </div>
  );
};

export default SideBar;

'use client';
import { Menu } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SideBarMenu } from '@/lib/constants';
import { useCurrentUser } from '@/lib/hooks';
import { cn, generateBreadcrumbItems } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import ThemeToggle from '../shared/ThemeToggle';
import UserButton from '../shared/UserButton';
import Breadcrumbs from './Breadcrumb';

const Header = () => {
  const pathname = 'Dashboard' + usePathname();
  const breadcrumbItems = generateBreadcrumbItems(pathname);
  const isActive = false;
  const user = useCurrentUser();
  return (
    <header className='flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6'>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' size='icon' className='shrink-0 md:hidden'>
            <Menu className='h-5 w-5' />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='flex flex-col'>
          <nav className='grid gap-2 text-lg font-medium'>
            {SideBarMenu.map((menu, i) => (
              <>
                {user?.role === 'DAS' && menu.role === 'DAS' && (
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
                )}
                {user?.role === 'HOD' && menu.role === 'HOD' && (
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
                )}
                {user?.role === 'TRAINER' && menu.role === 'TRAINER' && (
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
                )}
                {menu.role === 'All' && (
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
                )}
              </>
            ))}
          </nav>
          <div className='mt-auto'>
            <Button className='w-full'>User</Button>
          </div>
        </SheetContent>
      </Sheet>
      <div className='w-full flex-1'>
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <UserButton />
      <ThemeToggle />
    </header>
  );
};

export default Header;

'use client';

import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant='outline'
      size='icon'
      className='rounded-full'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <SunIcon className='absolute rotate-0 scale-100 text-foreground transition-all dark:-rotate-90 dark:scale-0' />
      <MoonIcon className='rotate-90 scale-0 text-foreground transition-all dark:rotate-0 dark:scale-100' />
    </Button>
  );
}

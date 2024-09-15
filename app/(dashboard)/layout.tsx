import Header from '@/components/dashboard/Header';
import SideBar from '@/components/dashboard/SideBar';
import React from 'react';

type Props = { children: React.ReactNode };

function DashboardLayout({ children }: Props) {
  return (
    <div className='grid min-h-screen w-screen md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
      <div className='hidden border-r bg-muted/40 md:block'>
        <SideBar />
      </div>
      <div className='flex flex-col'>
        <Header />
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;

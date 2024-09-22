import {
  AlarmClock,
  NotebookTabs,
  School,
  University,
  Users,
} from 'lucide-react';

export const SideBarMenu = [
  {
    role: 'All',
    title: 'Dashboard',
    icon: <University className='transition-all group-hover:scale-110' />,
    href: '/',
  },
  {
    role: 'HOD',
    title: 'Trainers',
    icon: <Users className='transition-all group-hover:scale-110' />,
    href: '/trainers',
  },
  {
    role: 'HOD',
    title: 'Modules',
    icon: <NotebookTabs className='transition-all group-hover:scale-110' />,
    href: '/modules',
  },
  {
    role: 'DAS',
    title: 'Rooms',
    icon: <School className='transition-all group-hover:scale-110' />,
    href: '/rooms',
  },
  {
    role: 'DAS',
    title: 'Time Table',
    icon: <AlarmClock className='transition-all group-hover:scale-110' />,
    href: '/timetable',
  },
];

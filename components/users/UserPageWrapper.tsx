'use client';

import SkeletonWrapper from '@/components/shared/SkeletonWrapper';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { useQuery } from '@tanstack/react-query';
import { startOfYear } from 'date-fns';
import { useState } from 'react';
import { getUserById } from '../_actions/user.actions';
import UserTable from './UserTable';

function UserPageWrapper() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfYear(new Date()),
    to: new Date(),
  });
  const user = useCurrentUser();
  const { data: dbUser, isFetching } = useQuery({
    queryKey: ['users'],
    queryFn: async () => await getUserById(user?.id!),
  });
  return (
    <Card>
      <CardHeader>
        <div className='flex flex-wrap items-center justify-between'>
          <div className=''>
            <SkeletonWrapper isLoading={isFetching}>
              <CardTitle className='text-3xl font-bold'>User</CardTitle>
            </SkeletonWrapper>
            <SkeletonWrapper isLoading={isFetching}>
              <CardDescription>
                Manage your users and view their sales performance.
              </CardDescription>
            </SkeletonWrapper>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        <UserTable />
      </CardContent>
    </Card>
  );
}

export default UserPageWrapper;

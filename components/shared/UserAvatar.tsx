'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUserById } from '@/lib/data/user';
import { useCurrentUser } from '@/lib/hooks';
import { ExtendedUser } from '@/lib/types/next-auth';
import { AvatarProps } from '@radix-ui/react-avatar';
import { useQuery } from '@tanstack/react-query';
import { User } from 'lucide-react';

interface UserAvatarProps extends AvatarProps {
  users?: Pick<ExtendedUser, 'image' | 'name'>;
}
export function UserAvatar({ users, ...props }: UserAvatarProps) {
  const currentUser = useCurrentUser();
  const { data: user } = useQuery({
    queryKey: ['userSession'],
    queryFn: async () => await getUserById(currentUser?.id!),
  });

  return (
    <Avatar {...props}>
      <AvatarImage src={user?.image!} alt={user?.name!} />
      <AvatarFallback>
        <User />
      </AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;

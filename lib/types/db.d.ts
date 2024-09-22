import { Trainer, User } from '@prisma/client';

export type DBExtendedTrainer = Trainer & {
  user: User;
};

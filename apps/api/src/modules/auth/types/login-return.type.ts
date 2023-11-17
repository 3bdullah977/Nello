import { User } from '@/modules/_schemas/user';

export type LoginReturnType = {
  user: Omit<User, 'isAdmin' | 'password' | 'imageUrl'>;
  token: string;
};

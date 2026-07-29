import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT as DefaultJWT } from 'next-auth/jwt';
import { User as AppUser } from './index';

declare module 'next-auth' {
  interface User extends DefaultUser {
    role: string;
    token: string;
    user: AppUser;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      token: string;
      user: AppUser;
    } & DefaultSession['user'];
  }

  interface JWT extends DefaultJWT {
    role: string;
    token: string;
    user: AppUser;
  }
}

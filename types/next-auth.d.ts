import NextAuth, { DefaultSession } from 'next-auth';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
      role: string;
      permissionType: string;
      accessToken: string;
    };
  }

  interface User {
    id?: string,
    role?: string,
    permissionType?: string,
    accessToken?: string
  }
  interface JWT {
    id: string;
    role: string;
    accessToken: string;
    permissionType: string;
  }
}
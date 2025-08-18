import { fetchApi } from '@/services/utlis/fetchApi';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Login',
      id: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },

      async authorize(credentials: any): Promise<any> {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }
          const employeeCredentials = {
            email: credentials.email,
            password: credentials.password
          };
          const response = await fetchApi(`/employee/login`, {
            method: 'POST',
            body: employeeCredentials
          });
          if (!response.success) {
            return null;
          }
          // Return the employee object from the API response
          const employee = response.employee;
          return {
            id: employee._id,
            name: employee.name,
            email: employee.email,
            image: employee.image,
            role: employee.role,
            permissionType: employee.permissionType,
            accessToken: employee.token
          };
        } catch (error) {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          accessToken: user.accessToken,
          permissionType: user.permissionType
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          permissionType: token.permissionType,
          accessToken: token.accessToken
        }
      };
    }
  },
  pages: {
    signIn: '/'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
};

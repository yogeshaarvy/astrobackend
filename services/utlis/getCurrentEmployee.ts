import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getSession } from 'next-auth/react';

export async function getCurrentEmployee() {
  try {
    const isServer = process.env.IS_SERVER_FLAG ? true : false;
    let session: any = undefined;
    if (isServer) {
      session = await getServerSession(authOptions);
    } else {
      session = await getSession();
    }

    if (!session || !session.user) {
      console.log('No session or user found in getCurrentEmployee');
      return null;
    }
    return session.user;
  } catch (error) {
    console.error('Error fetching current employee:', error);
    return null;
  }
}

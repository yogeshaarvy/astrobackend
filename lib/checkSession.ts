import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';

export async function checkSession(toLogin: boolean = true) {
  const data = await getServerSession(authOptions);

  if (data?.user) {
    redirect('/dashboard');
  } else {
    if (toLogin) {
      redirect('/');
    }
  }
}

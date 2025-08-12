'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useAppDispatch } from '@/redux/hooks';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password should be at least 6 characters long' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [loading, startTransition] = useTransition();

  const [formValues, setFormValues] = useState({
    email: '',
    password: ''
  });

  const defaultValues = {
    email: 'demo@gmail.com',
    password: 'password@123'
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        // Dispatch login action
        // const result = await dispatch(
        //   loginEmployee({ email: data.email, password: data.password })
        // );
        const result = await signIn('credentials', {
          redirect: false,
          email: formValues.email,
          password: formValues.password,
          callbackUrl
        });
        if (!result?.error) {
          router.push(callbackUrl);
          toast.success('Signed In Successfully!');
        } else {
          toast.error('Login failed');
        }
      } catch (error) {
        toast.error('An error occurred while logging in');
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={onSubmit} className="w-full space-y-2">
          <FormField
            name="email"
            // control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    // {...field}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            // control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Enter your password..."
                    disabled={loading}
                    // {...field}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Login
          </Button>
        </form>
      </Form>
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GithubSignInButton /> */}
    </>
  );
}

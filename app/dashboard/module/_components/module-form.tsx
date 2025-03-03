'use client';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addEditModule,
  updateModuleData,
  getSingleModule,
  IModule
} from '@/redux/slices/moduleSlice';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

const formSchema = z.object({
  // name: z.string().min(2, {
  //   message: 'Name must be at least 2 characters.'
  // })
});

export default function ModuleForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const entitiyId = searchParams.get('id');
  const {
    singleModuleState: { loading, data: mData = [] as IModule }
  } = useAppSelector((state) => state.module);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  });


  React.useEffect(() => {
    if (entitiyId) {
      dispatch(getSingleModule(entitiyId));
    }
  }, [dispatch]);

  const handleInputChange = (e: any) => {
    const { name, value, type, checked, files } = e.target;

    dispatch(
      updateModuleData({
        [name]:
          type === 'files'
            ? files[0]
            : type === 'checkbox'
            ? checked
            : type === 'number'
            ? Number(value)
            : value
      })
    );
  };

  const handleSubmit = async () => {
    try {
      const result = await dispatch(addEditModule(entitiyId)).unwrap(); // Attempt to unwrap the result
      if (!result?.error) {
        router.push('/dashboard/module');
        toast.success(result?.message);
        updateModuleData(null);
      } else {
        console.warn('Error object:', result.error);
        toast.error('Failed to add module. Please try again.');
      }
    } catch (error) {
      console.error('Error during submission:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {`${entitiyId ? 'Edit' : 'Add'} Module Information`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Your Module Name"
                    name="name"
                    onChange={handleInputChange}
                    value={mData?.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

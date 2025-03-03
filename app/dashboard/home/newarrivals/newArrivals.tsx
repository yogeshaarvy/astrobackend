'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addEditNewArrivals,
  fetchNewArrivals
} from '@/redux/slices/newArrivalsSlice';
import { toast } from 'sonner';
import CustomTextField from '@/utils/CustomTextField';
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form';

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const NewArrivals: React.FC = () => {
  const dispatch = useAppDispatch();

  const { data, loading, error } = useAppSelector(
    (state) => state.newArrivals.newarrivalsState
  );
  const [updatedData, setUpdatedData] = useState({
    title: '',
    description: '',
    active: false
  });
  const [isChecked, setIsChecked] = useState(false);

  const form = useForm({
    defaultValues: {
      title: '',
      description: ''
    }
  });
  // Handle Input Change
  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    setUpdatedData((prevData) => ({
      ...prevData,
      [name]:
        type === 'file'
          ? files?.[0]
          : type === 'checkbox'
          ? checked
          : type === 'number'
          ? Number(value)
          : value
    }));
  };
  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchNewArrivals());
  }, [dispatch]);

  // Populate form with fetched data
  useEffect(() => {
    if (data) {
      setUpdatedData({
        title: data[0]?.title || '',
        description: data[0]?.description || '',
        active: data[0]?.active || false
      });
      form.setValue('title', data[0]?.title || '');
      form.setValue('description', data[0]?.description || '');
      setIsChecked(data[0]?.active || false);
    }
  }, [data, form]);

  // Handle checkbox toggle
  const handleToggle = () => {
    const updatedData = {
      title: form.getValues('title'), // Get current title value
      description: form.getValues('description'), // Get current description value
      active: !isChecked // Toggle active state
    };

    setIsChecked(!isChecked);

    dispatch(addEditNewArrivals(updatedData))
      .unwrap()
      .then(() => {
        toast.success('Status updated successfully');
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  // Handle form submission
  const onSubmit = () => {
    dispatch(addEditNewArrivals(updatedData))
      .unwrap()
      // .then(() => {
      //   toast.success('Home category saved successfully');
      // })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <div className="container mx-auto">
      <div className="mt-4 flex justify-between">
        <h1 className="text-3xl font-semibold">Home Category</h1>
        <label className="inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleToggle}
            className="peer sr-only"
          />
          <div className="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
        </label>
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                <CustomTextField
                  name="title"
                  control={form.control}
                  label="Title"
                  placeholder="Enter title"
                  value={form.getValues('title')}
                  onChange={handleInputChange}
                />

                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <ReactQuill
                      className="text-xl"
                      value={form.watch('description')}
                      onChange={(value) => {
                        // Update the form value for 'description' manually
                        form.setValue('description', value);
                        // Update your local state if needed
                        setUpdatedData((prevData) => ({
                          ...prevData,
                          description: value
                        }));
                      }}
                      placeholder="Enter your description"
                      modules={{
                        toolbar: [
                          [{ header: '1' }, { header: '2' }, { font: [] }],
                          [{ list: 'ordered' }, { list: 'bullet' }],
                          ['bold', 'italic', 'underline'],
                          ['link'],
                          [{ align: [] }],
                          ['image']
                        ]
                      }}
                    />
                  </FormControl>
                </FormItem>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-blue-600 p-2 px-4 text-white hover:bg-blue-800 disabled:bg-blue-400"
                >
                  {loading ? (
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="mr-2 inline h-4 w-4 animate-spin text-white"
                      viewBox="0 0 100 101"
                      fill="none"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="#ffffff"
                      />
                    </svg>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default NewArrivals;

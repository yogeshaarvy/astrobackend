'use client';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic for SSR handling
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { addEditTermsConditions } from '@/redux/slices/terms_conditionsSlice';
import { useAppDispatch } from '@/redux/hooks';
import { useState } from 'react';
import { toast } from 'sonner';

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const TermsAndConditions: React.FC = () => {
  const dispatch = useAppDispatch();

  // Retrieve the saved long description from localStorage if available
  const savedDescription =
    typeof window !== 'undefined'
      ? localStorage.getItem('terms_conditions')
      : '';

  const form = useForm({
    defaultValues: {
      long_description: savedDescription || '' // Fallback to an empty string if undefined
    }
  });

  const [isChecked, setIsChecked] = useState(false); // Default value is false
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handletoggle = () => {
    setIsChecked((prevState) => !prevState); // Toggle the value between true and false
    toast.success('Status Updated successfully');
  };

  const onSubmit = async (data: { long_description: string }) => {
    try {
      setIsSubmitting(true);

      const result = await dispatch(
        addEditTermsConditions({
          description: data.long_description,
          active: isChecked
        })
      ).unwrap();

      // toast.success("Data submitted successfully!");
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error('Failed to submit data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save the description to localStorage whenever it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Ensure value.long_description is always a string
      const longDescription = value.long_description || '';
      localStorage.setItem('terms_conditions', longDescription);
    });

    return () => subscription.unsubscribe(); // Clean up subscription on unmount
  }, [form]);

  return (
    <div className="container mx-auto">
      <div className="mt-4 flex justify-between">
        <h1 className="text-3xl font-semibold">Terms and Conditions</h1>

        <label className="inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            value="false"
            className="peer sr-only"
            onChange={handletoggle}
          />
          <div className="peer relative h-6 w-11  rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
        </label>
      </div>

      <div className="mt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormControl>
                <ReactQuill
                  className="h-80 text-xl "
                  value={form.watch('long_description') || ''} // Ensure fallback to empty string
                  onChange={(value) =>
                    form.setValue('long_description', value || '')
                  } // Ensure fallback to empty string
                  placeholder="Enter your long description"
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

            <div className="flex translate-x-1 translate-y-10 justify-end">
              <button
                type="submit"
                id="submitbutton"
                disabled={isSubmitting}
                className="rounded-md bg-blue-600 p-2 px-4 text-white hover:bg-blue-800"
              >
                {isSubmitting ? (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="me-3 inline h-4 w-4 animate-spin text-gray-200 dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#1C64F2"
                    />
                  </svg>
                ) : (
                  ''
                )}
                Submit
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TermsAndConditions;

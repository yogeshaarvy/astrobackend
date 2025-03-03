'use client';
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
// import { addEditSales } from "@/redux/slices/salesSlice"
import { addEditMidbanner } from '@/redux/slices/midbanner';
import { toast } from 'sonner';
import PageContainer from '@/components/layout/page-container';

interface FormData {
  image: string;
  title: string;
  description: string;
  link: string;
}

const MidBanner: React.FC = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<FormData>({
    image: '',
    title: '',
    description: '',
    link: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setImagePreview(imageDataUrl);
        setFormData((prevState) => ({
          ...prevState,
          image: file as any
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (): void => {
    setImagePreview('');
    setFormData((prevState) => ({
      ...prevState,
      image: ''
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const result = await dispatch(addEditMidbanner(formData)).unwrap();
      toast.success('Data submitted successfully!');
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error('Failed to submit data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500';
  const labelClasses =
    'mb-2 block text-sm font-medium text-gray-900 dark:text-white';

  return (
    <PageContainer scrollable>
      <form className="grid grid-cols-1 gap-6 p-10" onSubmit={handleSubmit}>
        {/* Image Upload */}
        <div className="mb-5">
          <label htmlFor="image" className={labelClasses}>
            Banner Image
          </label>
          <div className="space-y-2">
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              accept="image/*"
              className="block w-full p-2.5"
              required
            />
            <div className="relative mt-2">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 max-w-xs rounded-lg border border-gray-300 object-contain"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute left-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <div className="flex h-32 max-w-xs items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                  <span className="text-sm text-gray-500">
                    No image selected
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Title Input */}
        <div className="mb-5">
          <label htmlFor="title" className={labelClasses}>
            Banner Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>

        {/* Description Input */}
        <div className="mb-5">
          <label htmlFor="mid_description" className={labelClasses}>
            Banner Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={inputClasses}
            rows={4}
            required
          />
        </div>

        <div className="mb-5">
          <label htmlFor="Link" className={labelClasses}>
            Banner link
          </label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-32 rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
            'Submit'
          )}
        </button>
      </form>
    </PageContainer>
  );
};

export default MidBanner;

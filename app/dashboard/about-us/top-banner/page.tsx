'use client';
import { useAppDispatch } from '@/redux/hooks';
import {
  addEditAboutusTopBanner,
  fetchAboutusTopBanner
} from '@/redux/slices/aboutus_topbannerSlice';
import { X } from 'lucide-react';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';

const Page = () => {
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState();
  const [formData, setFormData] = useState({
    banner_image: '',
    title: ''
  });
  const dispatch = useAppDispatch();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const { name } = event.target;

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setFormData({
          ...formData,
          [name]: file
        });
        setImagePreviews((prev) => ({
          ...prev,
          [name]: imageDataUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (fieldName: string) => {
    setImagePreviews((prev) => ({
      ...prev,
      [fieldName]: '' // ✅ Correctly clearing the preview image
    }));

    setFormData((prev) => ({
      ...prev,
      [fieldName]: '' // ✅ Correctly clearing the actual file
    }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    dispatch(
      addEditAboutusTopBanner({
        banner_image: formData.banner_image,
        title: formData.title
      })
    );
  };

  const inputClasses =
    'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500';
  const labelClasses =
    'mb-2 block text-sm font-medium text-gray-900 dark:text-white';
  return (
    <div className="border border-black">
      <form className="grid grid-cols-1 gap-6 p-10" onSubmit={handleSubmit}>
        <div className="flex gap-10">
          <div className="mb-5">
            <label htmlFor="background_image" className={labelClasses}>
              Banner Image
            </label>
            <div className="space-y-2">
              <input
                type="file"
                name="banner_image"
                onChange={handleImageChange}
                accept="image/*"
                className="block w-full p-2.5"
              />
              <div className="relative mt-2">
                {imagePreviews ? (
                  <>
                    <img
                      src={imagePreviews.banner_image}
                      alt="Background Preview"
                      className="h-32 max-w-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('background_image')}
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

          <div className="mb-5">
            <label htmlFor="heading" className={labelClasses}>
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Enter heading"
              required
            />
          </div>
        </div>

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
    </div>
  );
};

export default Page;

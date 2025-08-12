'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addEditRegisterImage,
  fetchRegisterImage
} from '@/redux/slices/register-imageSlice';
import { X } from 'lucide-react';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';

const Page = () => {
  const dispatch = useAppDispatch();
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selector = useAppSelector(
    (state) => state.registerImage.registerImageState.data
  );

  const [formData, setFormData] = useState({
    backgroundImage: '',
    title: '',
    description: ''
  });

  // Fetch Data on Mount
  useEffect(() => {
    dispatch(fetchRegisterImage());
  }, [dispatch]);

  // Update Form Data when `selector` is available
  useEffect(() => {
    if (selector?.RegisterImage?.length) {
      setFormData({
        backgroundImage: selector.RegisterImage[0].backgroundImage || '',
        title: selector.RegisterImage[0].title || '',
        description: selector.RegisterImage[0].description || ''
      });

      setImagePreviews({
        backgroundImage: selector.RegisterImage[0].backgroundImage || ''
      });
    }
  }, [selector]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const { name } = event.target;

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [name]: file
        }));
        setImagePreviews((prev) => ({
          ...prev,
          [name]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (fieldName: string) => {
    setImagePreviews((prev) => ({
      ...prev,
      [fieldName]: ''
    }));

    setFormData((prev) => ({
      ...prev,
      [fieldName]: ''
    }));

    // Reset the file input field
    const input = document.querySelector(
      `input[name="${fieldName}"]`
    ) as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    await dispatch(
      addEditRegisterImage({
        backgroundImage: formData.backgroundImage,
        title: formData.title,
        description: formData.description
      })
    );

    setIsSubmitting(false);
  };

  const inputClasses =
    'block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500';
  const labelClasses =
    'mb-2 block text-sm font-medium text-gray-900 dark:text-white';

  return (
    <div>
      <form className="p-4" onSubmit={handleSubmit}>
        <div className="flex justify-between">
          {/* Image Upload */}
          <div className="mb-5 w-4/12">
            <label htmlFor="backgroundImage" className={labelClasses}>
              Background Image
            </label>
            <div className="space-y-2">
              <input
                type="file"
                name="backgroundImage"
                onChange={handleImageChange}
                accept="image/*"
                className="block w-full p-2.5"
              />
              <div className="relative mt-2">
                {imagePreviews.backgroundImage ? (
                  <>
                    <img
                      src={imagePreviews.backgroundImage}
                      alt="Background Preview"
                      className="h-32 max-w-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('backgroundImage')}
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

          {/* Title */}
          <div className="mb-5 w-3/12">
            <label htmlFor="title" className={labelClasses}>
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Enter title"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-5 w-3/12">
            <label htmlFor="description" className={labelClasses}>
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Enter description"
              required
            />
          </div>
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
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z"
                fill="currentColor"
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

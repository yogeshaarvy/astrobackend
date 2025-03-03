'use client';
import React, {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent
} from 'react';
import { X } from 'lucide-react';
import { useAppDispatch } from '@/redux/hooks';
import { addEditMidbanner } from '@/redux/slices/midbanner';
import { toast } from 'sonner';
import {
  addEditHomeAbout,
  fetchHomeAbout
} from '@/redux/slices/homeaboutSlice';

interface FormData {
  background_image: string;
  main_image: string;
  icon1: string;
  icon2: string;
  icon3: string;
  title1: string;
  title2: string;
  title3: string;
  heading: string;
}

const About: React.FC = () => {
  const dispatch = useAppDispatch();
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    background_image: '',
    main_image: '',
    icon1: '',
    icon2: '',
    icon3: '',
    title1: '',
    title2: '',
    title3: '',
    heading: ''
  });

  useEffect(() => {
    dispatch(fetchHomeAbout())
      .unwrap()
      .then((response) => {
        if (response?.homeaboutData?.[0]) {
          const prevData = response.homeaboutData[0];
          setFormData((prev) => ({
            ...prev,
            title1: prevData.title1 || '',
            title2: prevData.title2 || '',
            title3: prevData.title3 || '',
            heading: prevData.heading || '',
            background_image: prevData.background_image || '',
            main_image: prevData.main_image || '',
            icon1: prevData.icon1 || '',
            icon2: prevData.icon2 || '',
            icon3: prevData.icon3 || ''
          }));

          // Set existing image previews
          setImagePreviews({
            background_image: prevData.background_image || '',
            main_image: prevData.main_image || '',
            icon1: prevData.icon1 || '',
            icon2: prevData.icon2 || '',
            icon3: prevData.icon3 || ''
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching home about data:', error);
        toast.error('Failed to load previous data');
      });
  }, [dispatch]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const { name } = event.target;

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setFormData((prevState) => ({
          ...prevState,
          [name]: file
        }));
        setImagePreviews((prev) => ({
          ...prev,
          [name]: imageDataUrl
        }));
      };
      reader.readAsDataURL(file);
    }
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
      const result = await dispatch(addEditHomeAbout(formData)).unwrap();
      toast.success('Data submitted successfully!');
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error('Failed to submit data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = (fieldName: string) => {
    setImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[fieldName];
      return newPreviews;
    });
    setFormData((prev) => ({
      ...prev,
      [fieldName]: ''
    }));
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
              Background Image
            </label>
            <div className="space-y-2">
              <input
                type="file"
                name="background_image"
                onChange={handleImageChange}
                accept="image/*"
                className="block w-full p-2.5"
              />
              <div className="relative mt-2">
                {imagePreviews.background_image ? (
                  <>
                    <img
                      src={imagePreviews.background_image}
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
            <label htmlFor="main_image" className={labelClasses}>
              Main Image
            </label>
            <div className="space-y-2">
              <input
                type="file"
                name="main_image"
                onChange={handleImageChange}
                accept="image/*"
                className="block w-full p-2.5"
              />
              <div className="relative mt-2">
                {imagePreviews.main_image ? (
                  <>
                    <img
                      src={imagePreviews.main_image}
                      alt="Main Preview"
                      className="h-32 max-w-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('main_image')}
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
        </div>

        <div className="flex justify-between border p-5">
          <div className="flex flex-col">
            <label htmlFor="icon1" className={labelClasses}>
              Icon 1
            </label>
            <div className="space-y-2">
              <input
                type="file"
                name="icon1"
                onChange={handleImageChange}
                accept="image/*"
                className="block w-full p-2.5"
              />
              <div className="relative mt-2">
                {imagePreviews.icon1 ? (
                  <>
                    <img
                      src={imagePreviews.icon1}
                      alt="Icon 1 Preview"
                      className="h-16 w-16"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('icon1')}
                      className="absolute left-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      <X size={10} />
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
            <div className="mt-5">
              <label htmlFor="title1" className={labelClasses}>
                Title 1
              </label>
              <input
                type="text"
                id="title1"
                name="title1"
                value={formData.title1}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter title 1"
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="icon2" className={labelClasses}>
              Icon 2
            </label>
            <div className="space-y-2">
              <input
                type="file"
                name="icon2"
                onChange={handleImageChange}
                accept="image/*"
                className="block w-full p-2.5"
              />
              <div className="relative mt-2">
                {imagePreviews.icon2 ? (
                  <>
                    <img
                      src={imagePreviews.icon2}
                      alt="Icon 2 Preview"
                      className="h-16 w-16"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('icon2')}
                      className="absolute left-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      <X size={10} />
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
            <div className="mt-5">
              <label htmlFor="title2" className={labelClasses}>
                Title 2
              </label>
              <input
                type="text"
                id="title2"
                name="title2"
                value={formData.title2}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter title 2"
                required
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="icon3" className={labelClasses}>
              Icon 3
            </label>
            <div className="space-y-2">
              <input
                type="file"
                name="icon3"
                onChange={handleImageChange}
                accept="image/*"
                className="block w-full p-2.5"
              />
              <div className="relative mt-2">
                {imagePreviews.icon3 ? (
                  <>
                    <img
                      src={imagePreviews.icon3}
                      alt="Icon 3 Preview"
                      className="h-16 w-16"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('icon3')}
                      className="absolute left-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      <X size={10} />
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
            <div className="mt-5">
              <label htmlFor="title3" className={labelClasses}>
                Title 3
              </label>
              <input
                type="text"
                id="title3"
                name="title3"
                value={formData.title3}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Enter title 3"
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="heading" className={labelClasses}>
            Heading
          </label>
          <input
            type="text"
            id="heading"
            name="heading"
            value={formData.heading}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Enter heading"
            required
          />
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
      {/* </PageContainer> */}
    </div>
  );
};

export default About;

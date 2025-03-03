'use client';
import React, {
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
  useEffect
} from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { addEditSales, fetchSales } from '@/redux/slices/salesSlice';
import { toast } from 'sonner';
import PageContainer from '@/components/layout/page-container';

interface FormData {
  main_heading: string;
  main_description: string;
  left_image: string;
  left_image_title: string;
  left_image_description: string;
  left_image_link: string;
  mid_upper_image: string;
  mid_upper_image_title: string;
  mid_upper_image_description: string;
  mid_upper_image_link: string;
  mid_lower_image: string;
  mid_lower_image_title: string;
  mid_lower_image_description: string;
  mid_lower_image_link: string;
  right_image: string;
  right_image_title: string;
  right_image_description: string;
  right_image_link: string;
}

const Sales: React.FC = () => {
  const [LeftImagePreview, setLeftImagePreview] = useState<string>('');
  const [RightImagePreview, setRightImagePreview] = useState<string>('');
  const [MidUpperImagePreview, setMidUpperImagePreview] = useState<string>('');
  const [MidLowerImagePreview, setMidLowerImagePreview] = useState<string>('');
  const LeftImageInputRef = useRef<HTMLInputElement>(null);
  const RightImageInputRef = useRef<HTMLInputElement>(null);
  const MidUpperImageInputRef = useRef<HTMLInputElement>(null);
  const MidLowerImageInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const {
    salesState: { data }
  } = useAppSelector((state) => state.sales);
  const [formData, setFormData] = useState({
    main_heading: '',
    main_description: '',
    left_image: '',
    left_image_title: '',
    left_image_description: '',
    left_image_link: '',
    mid_upper_image: '',
    mid_upper_image_title: '',
    mid_upper_image_description: '',
    mid_upper_image_link: '',
    mid_lower_image: '',
    mid_lower_image_title: '',
    mid_lower_image_description: '',
    mid_lower_image_link: '',
    right_image: '',
    right_image_title: '',
    right_image_description: '',
    right_image_link: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLeftImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLeftImagePreview(reader.result as string);
        setFormData({
          ...formData,
          left_image: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRightImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRightImagePreview(reader.result as string);
        setFormData({
          ...formData,
          right_image: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMidUpperChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMidUpperImagePreview(reader.result as string);
        setFormData({
          ...formData,
          mid_upper_image: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMidLowerChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMidLowerImagePreview(reader.result as string);
        setFormData({
          ...formData,
          mid_lower_image: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLeftimage = (): void => {
    setLeftImagePreview('');
    if (LeftImageInputRef.current) {
      LeftImageInputRef.current.value = '';
    }
  };

  const removeRightImage = (): void => {
    setRightImagePreview('');
    if (RightImageInputRef.current) {
      RightImageInputRef.current.value = '';
    }
  };

  const removeMidUpperImage = (): void => {
    setMidUpperImagePreview('');
    if (MidUpperImageInputRef.current) {
      MidUpperImageInputRef.current.value = '';
    }
  };
  const removeMidLowerImage = (): void => {
    setMidLowerImagePreview('');
    if (MidLowerImageInputRef.current) {
      MidLowerImageInputRef.current.value = '';
    }
  };

  // const { loading, error } = useSelector((state: RootState) => state.settings.settingsState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    dispatch(fetchSales());
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      const result = await dispatch(addEditSales(formData)).unwrap();

      toast.success('Data submitted successfully!');
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error('Failed to submit data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer scrollable>
      <div>
        <form
          className="grid grid-cols-1 gap-6 p-10 md:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <div className="mb-5">
            <label
              htmlFor="left_image"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Left Image
            </label>
            <div className="space-y-2">
              <input
                type="file"
                id="left_image"
                ref={LeftImageInputRef}
                // value={formData.logo}
                onChange={handleLeftImageChange}
                accept="image/*"
                className=" block w-full p-2.5"
                required
              />
              <div className="relative mt-2">
                {LeftImagePreview ? (
                  <>
                    <img
                      src={LeftImagePreview}
                      alt="Preview"
                      className="h-32 max-w-xs rounded-lg border border-gray-300 object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeLeftimage}
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
            <label
              htmlFor="right_image"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Right Image
            </label>
            <div className="space-y-2">
              <input
                type="file"
                id="right_image"
                ref={RightImageInputRef}
                onChange={handleRightImageChange}
                accept="image/*"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                required
              />
              <div className="relative mt-2">
                {RightImagePreview ? (
                  <>
                    <img
                      src={RightImagePreview}
                      alt="Favicon Preview"
                      className="h-32 max-w-xs rounded-lg border border-gray-300 object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeRightImage}
                      className="absolute left-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <div className="flex h-32 max-w-xs items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                    <span className="text-xs text-gray-500">No icon</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="mid_upper_image"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Mid Upper Image
            </label>
            <div className="space-y-2">
              <input
                type="file"
                id="mid_upper_image"
                ref={MidUpperImageInputRef}
                onChange={handleMidUpperChange}
                accept="image/*"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                required
              />
              <div className="relative mt-2">
                {MidUpperImagePreview ? (
                  <>
                    <img
                      src={MidUpperImagePreview}
                      alt="Favicon Preview"
                      className="h-32 max-w-xs rounded-lg border border-gray-300 object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeMidUpperImage}
                      className="absolute left-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <div className="flex h-32 max-w-xs items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                    <span className="text-xs text-gray-500">No icon</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="mid_lower_image"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Mid Lower Image
            </label>
            <div className="space-y-2">
              <input
                type="file"
                id="mid_Lower_image"
                ref={MidLowerImageInputRef}
                onChange={handleMidLowerChange}
                accept="image/*"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                required
              />
              <div className="relative mt-2">
                {MidLowerImagePreview ? (
                  <>
                    <img
                      src={MidLowerImagePreview}
                      alt="Favicon Preview"
                      className="h-32 max-w-xs rounded-lg border border-gray-300 object-contain"
                    />
                    <button
                      type="button"
                      onClick={removeMidLowerImage}
                      className="absolute left-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <div className="flex h-32 max-w-xs items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                    <span className="text-xs text-gray-500">No icon</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="main_heading"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Main Heading
            </label>
            <input
              type="text"
              id="main_heading"
              name="main_heading"
              value={formData.main_heading}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="main_description"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Main Description
            </label>
            <input
              type="text"
              id="main_description"
              value={formData.main_description}
              onChange={handleChange}
              name="main_description"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="left_image_title"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Left Image Title
            </label>
            <input
              type="text"
              id="left_image_title"
              value={formData.left_image_title}
              onChange={handleChange}
              name="left_image_title"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="left_image_description"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Left Image Description
            </label>
            <input
              type="text"
              id="left_image_description"
              value={formData.left_image_description}
              onChange={handleChange}
              name="left_image_description"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="left_image_link"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Left Image Link
            </label>
            <input
              type="url"
              id="left_image_link"
              value={formData.left_image_link}
              onChange={handleChange}
              name="left_image_link"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="mid_upper_image_title"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Mid Upper Image Title
            </label>
            <input
              type="text"
              id="mid_upper_image_title"
              value={formData.mid_upper_image_title}
              onChange={handleChange}
              name="mid_upper_image_title"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="mid_upper_image_description"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Mid Upper Image Description
            </label>
            <input
              type="text"
              id="mid_upper_image_description"
              value={formData.mid_upper_image_description}
              onChange={handleChange}
              name="mid_upper_image_description"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="mid_upper_image_link"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Mid Upper Image Link
            </label>
            <input
              type="url"
              id="mid_upper_image_link"
              value={formData.mid_upper_image_link}
              onChange={handleChange}
              name="mid_upper_image_link"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="mid_lower_image_link"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Mid Lower Image Link
            </label>
            <input
              type="url"
              id="mid_lower_image_link"
              value={formData.mid_lower_image_link}
              onChange={handleChange}
              name="mid_lower_image_link"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="right_image_title"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Right Image Title
            </label>
            <input
              type="text"
              id="right_image_title"
              value={formData.right_image_title}
              onChange={handleChange}
              name="right_image_title"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="right_image_description"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Right Image Description
            </label>
            <input
              type="text"
              id="right_image_description"
              value={formData.right_image_description}
              onChange={handleChange}
              name="right_image_description"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="right_image_link"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Right Image Link
            </label>
            <input
              type="url"
              id="right_image_link"
              value={formData.right_image_link}
              onChange={handleChange}
              name="right_image_link"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-32 rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {' '}
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
        </form>
      </div>
    </PageContainer>
  );
};

export default Sales;

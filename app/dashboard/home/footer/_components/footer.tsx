'use client';
import type React from 'react';
import {
  useState,
  useRef,
  type ChangeEvent,
  type FormEvent,
  useEffect
} from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useAppDispatch } from '@/redux/hooks';
import { toast } from 'sonner';
import PageContainer from '@/components/layout/page-container';
import {
  addEdithomeFooter,
  fetchhomeFooter
} from '@/redux/slices/homeFooterSlice';

interface FormData {
  logo: any;
  description: string;
  social_icon1: any;
  social_icon1_link: string;
  social_icon2: any;
  social_icon2_link: string;
  social_icon3: any;
  social_icon3_link: string;
  social_icon4: any;
  social_icon4_link: string;
  social_icon5: any;
  social_icon5_link: string;
  title1: string;
  title1_subtitle: string;
  title1_link1_heading: string;
  title1_link1: string;
  title1_link2_heading: string;
  title1_link2: string;
  title1_link3_heading: string;
  title1_link3: string;
  title1_link4_heading: string;
  title1_link4: string;
  title1_link5_heading: string;
  title1_link5: string;
  title1_link6_heading: string;
  title1_link6: string;
  title2: string;
  title2_subtitle: string;
  title2_link1_heading: string;
  title2_link1: string;
  title2_link2_heading: string;
  title2_link2: string;
  title2_link3_heading: string;
  title2_link3: string;
  title2_link4_heading: string;
  title2_link4: string;
  title3: string;
  title3_subtitle: string;
  title3_link1_heading: string;
  title3_link1: string;
  title3_link2_heading: string;
  title3_link2: string;
  title3_link3_heading: string;
  title3_link3: string;
  title3_link4_heading: string;
  title3_link4: string;
}

const Footer: React.FC = () => {
  const [logoPreview, setlogoPreview] = useState<string>('');
  const [socialIcon1Preview, setSocialIcon1Preview] = useState<string>('');
  const [socialIcon2Preview, setSocialIcon2Preview] = useState<string>('');
  const [socialIcon3Preview, setSocialIcon3Preview] = useState<string>('');
  const [socialIcon4Preview, setSocialIcon4Preview] = useState<string>('');
  const [socialIcon5Preview, setSocialIcon5Preview] = useState<string>('');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const socialIcon1Inputref = useRef<HTMLInputElement>(null);
  const socialIcon2Inputref = useRef<HTMLInputElement>(null);
  const socialIcon3Inputref = useRef<HTMLInputElement>(null);
  const socialIcon4Inputref = useRef<HTMLInputElement>(null);
  const socialIcon5Inputref = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<FormData>({
    logo: '',
    description: '',
    social_icon1: '',
    social_icon1_link: '',
    social_icon2: '',
    social_icon2_link: '',
    social_icon3: '',
    social_icon3_link: '',
    social_icon4: '',
    social_icon4_link: '',
    social_icon5: '',
    social_icon5_link: '',
    title1: '',
    title1_subtitle: '',
    title1_link1_heading: '',
    title1_link1: '',
    title1_link2_heading: '',
    title1_link2: '',
    title1_link3_heading: '',
    title1_link3: '',
    title1_link4_heading: '',
    title1_link4: '',
    title1_link5_heading: '',
    title1_link5: '',
    title1_link6_heading: '',
    title1_link6: '',
    title2: '',
    title2_subtitle: '',
    title2_link1_heading: '',
    title2_link1: '',
    title2_link2_heading: '',
    title2_link2: '',
    title2_link3_heading: '',
    title2_link3: '',
    title2_link4_heading: '',
    title2_link4: '',
    title3: '',
    title3_subtitle: '',
    title3_link1_heading: '',
    title3_link1: '',
    title3_link2_heading: '',
    title3_link2: '',
    title3_link3_heading: '',
    title3_link3: '',
    title3_link4_heading: '',
    title3_link4: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchhomeFooter())
      .unwrap()
      .then((response) => {
        if (response?.updatedFooterData[0]) {
          const prevData = response?.updatedFooterData[0];
          setFormData((prev) => ({
            ...prev,
            // logo: '',
            description: prevData.description,
            // social_icon1:
            social_icon1_link: prevData.social_icon1_link,
            // social_icon2: '',
            social_icon2_link: prevData.social_icon2_link,
            // social_icon3: '',
            social_icon3_link: prevData.social_icon3_link,
            // social_icon4: '',
            social_icon4_link: prevData.social_icon4_link,
            // social_icon5: '',
            social_icon5_link: prevData.social_icon5_link,
            title1: prevData.title1,
            title1_subtitle: prevData.title1_subtitle,
            title1_link1_heading: prevData.title1_subtitle,
            title1_link1: prevData.title1_subtitle,
            title1_link2_heading: prevData.title1_subtitle,
            title1_link2: prevData.title1_subtitle,
            title1_link3_heading: prevData.title1_subtitle,
            title1_link3: prevData.title1_subtitle,
            title1_link4_heading: prevData.title1_subtitle,
            title1_link4: prevData.title1_subtitle,
            title1_link5_heading: prevData.title1_subtitle,
            title1_link5: prevData.title1_subtitle,
            title1_link6_heading: prevData.title1_subtitle,
            title1_link6: prevData.title1_subtitle,
            title2: prevData.title2,
            title2_subtitle: prevData.title2_subtitle,
            title2_link1_heading: prevData.title2_link1_heading,
            title2_link1: prevData.title2_link1,
            title2_link2_heading: prevData.title2_link2_heading,
            title2_link2: prevData.title2_link2,
            title2_link3_heading: prevData.title2_link3_heading,
            title2_link3: prevData.title2_link3,
            title2_link4_heading: prevData.title2_link4_heading,
            title2_link4: prevData.title2_link4,
            title3: prevData.title3,
            title3_subtitle: prevData.title3_subtitle,
            title3_link1_heading: prevData.title3_link1_heading,
            title3_link1: prevData.title3_link1,
            title3_link2_heading: prevData.title3_link2_heading,
            title3_link2: prevData.title3_link2,
            title3_link3_heading: prevData.title3_link3_heading,
            title3_link3: prevData.title3_link3,
            title3_link4_heading: prevData.title3_link4_heading,
            title3_link4: prevData.title3_link4
          }));

          // Set existing image previews
          // setImagePreviews({
          //   background_image: prevData.background_image || '',
          //   main_image: prevData.main_image || '',
          //   icon1: prevData.icon1 || '',
          //   icon2: prevData.icon2 || '',
          //   icon3: prevData.icon3 || ''
          // });
          setlogoPreview(prevData.logo);
          setSocialIcon1Preview(prevData.social_icon1);
          setSocialIcon2Preview(prevData.social_icon2);
          setSocialIcon3Preview(prevData.social_icon3);
          setSocialIcon4Preview(prevData.social_icon4);
          setSocialIcon5Preview(prevData.social_icon5);
        }
      })
      .catch((error) => {
        console.error('Error fetching home about data:', error);
        toast.error('Failed to load previous data');
      });
  }, [dispatch]);

  const handlelogoChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setlogoPreview(reader.result as string);
        setFormData({
          ...formData,
          logo: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlesocial_icon1Change = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSocialIcon1Preview(reader.result as string);
        setFormData({
          ...formData,
          social_icon1: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlesocial_icon2Change = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSocialIcon2Preview(reader.result as string);
        setFormData({
          ...formData,
          social_icon2: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlesocial_icon3Change = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSocialIcon3Preview(reader.result as string);
        setFormData({
          ...formData,
          social_icon3: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlesocial_icon4Change = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSocialIcon4Preview(reader.result as string);
        setFormData({
          ...formData,
          social_icon4: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlesocial_icon5Change = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSocialIcon5Preview(reader.result as string);
        setFormData({
          ...formData,
          social_icon5: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removelogo = (): void => {
    setlogoPreview('');
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const removesocial_icon1 = (): void => {
    setSocialIcon1Preview('');
    if (socialIcon1Inputref.current) {
      socialIcon1Inputref.current.value = '';
    }
  };

  const removesocial_icon2 = (): void => {
    setSocialIcon2Preview('');
    if (socialIcon2Inputref.current) {
      socialIcon2Inputref.current.value = '';
    }
  };

  const removesocial_icon3 = (): void => {
    setSocialIcon3Preview('');
    if (socialIcon3Inputref.current) {
      socialIcon3Inputref.current.value = '';
    }
  };

  const removesocial_icon4 = (): void => {
    setSocialIcon4Preview('');
    if (socialIcon4Inputref.current) {
      socialIcon4Inputref.current.value = '';
    }
  };

  const removesocial_icon5 = (): void => {
    setSocialIcon5Preview('');
    if (socialIcon5Inputref.current) {
      socialIcon5Inputref.current.value = '';
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
      // const sendFormData= {
      //   ...formData,
      //   logo:formData.logo,
      //   social_icon1:formData.social_icon1,
      //   social_icon2:formData.social_icon2,
      //   social_icon3:formData.social_icon3,
      //   social_icon4:formData.social_icon4,
      //   social_icon5:formData.social_icon5,
      // }

      const result = await dispatch(addEdithomeFooter(formData)).unwrap();

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
              htmlFor="logo"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              logo
            </label>
            <div className="space-y-2">
              <input
                type="file"
                id="logo"
                ref={logoInputRef}
                onChange={handlelogoChange}
                accept="image/*"
                className=" block w-full p-2.5"
              />
              <div className="relative mt-2">
                {logoPreview ? (
                  <>
                    <img
                      src={logoPreview || '/placeholder.svg'}
                      alt="Preview"
                      className="h-32 max-w-xs rounded-lg border border-gray-300 object-contain"
                    />
                    <button
                      type="button"
                      onClick={removelogo}
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
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>

          <div className=" font-semibold- col-span-2 text-4xl">
            <h1>Social Media</h1>
          </div>

          <div className="mb-5">
            <label
              htmlFor="social_icon1"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Social Icon 1
            </label>
            <div className="space-y-2">
              <input
                type="file"
                id="social_icon1"
                ref={socialIcon1Inputref}
                onChange={handlesocial_icon1Change}
                accept="image/*"
                className=" block w-full p-2.5"
              />
              <div className="relative mt-2">
                {socialIcon1Preview ? (
                  <>
                    <img
                      src={socialIcon1Preview || '/placeholder.svg'}
                      alt="Preview"
                      className="h-32 max-w-xs rounded-lg border border-gray-300 object-contain"
                    />
                    <button
                      type="button"
                      onClick={removesocial_icon1}
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
              htmlFor="social_icon1_link"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              social Icon1 Link
            </label>
            <input
              type="url"
              id="social_icon1_link"
              value={formData.social_icon1_link}
              onChange={handleChange}
              name="social_icon1_link"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>

          {/* Social Icon 2 */}
          <div className="mb-5">
            <label
              htmlFor="social_icon2"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Social Icon 2
            </label>
            <div className="space-y-2">
              <input
                type="file"
                id="social_icon2"
                ref={socialIcon2Inputref}
                onChange={handlesocial_icon2Change}
                accept="image/*"
                className=" block w-full p-2.5"
              />
              <div className="relative mt-2">
                {socialIcon2Preview ? (
                  <>
                    <img
                      src={socialIcon2Preview || '/placeholder.svg'}
                      alt="Preview"
                      className="h-32 max-w-xs rounded-lg border border-gray-300 object-contain"
                    />
                    <button
                      type="button"
                      onClick={removesocial_icon2}
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
              htmlFor="social_icon2_link"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Social Icon 2 Link
            </label>
            <input
              type="url"
              id="social_icon2_link"
              name="social_icon2_link"
              value={formData.social_icon2_link}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="social_icon3"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Social Icon3
            </label>
            <div className="space-y-2">
              <input
                type="file"
                id="social_icon3"
                ref={socialIcon3Inputref}
                onChange={handlesocial_icon3Change}
                accept="image/*"
                className=" block w-full p-2.5"
              />
              <div className="relative mt-2">
                {socialIcon3Preview ? (
                  <>
                    <img
                      src={socialIcon3Preview || '/placeholder.svg'}
                      alt="Preview"
                      className="h-32 max-w-xs rounded-lg border border-gray-300 object-contain"
                    />
                    <button
                      type="button"
                      onClick={removesocial_icon3}
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
              htmlFor="social_icon3_link"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Social Icon 3 Link
            </label>
            <input
              type="url"
              id="social_icon3_link"
              name="social_icon3_link"
              value={formData.social_icon3_link}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="social_icon4"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Social Icon 4
            </label>
            <div className="space-y-2">
              <input
                type="file"
                id="social_icon4"
                ref={socialIcon4Inputref}
                onChange={handlesocial_icon4Change}
                accept="image/*"
                className=" block w-full p-2.5"
              />
              <div className="relative mt-2">
                {socialIcon4Preview ? (
                  <>
                    <img
                      src={socialIcon4Preview || '/placeholder.svg'}
                      alt="Preview"
                      className="h-32 max-w-xs rounded-lg border border-gray-300 object-contain"
                    />
                    <button
                      type="button"
                      onClick={removesocial_icon4}
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
              htmlFor="social_icon4_link"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Social Icon 4 Link
            </label>
            <input
              type="url"
              id="social_icon4_link"
              name="social_icon4_link"
              value={formData.social_icon4_link}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="social_icon5"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Social Icon5
            </label>
            <div className="space-y-2">
              <input
                type="file"
                id="social_icon5"
                ref={socialIcon5Inputref}
                onChange={handlesocial_icon5Change}
                accept="image/*"
                className=" block w-full p-2.5"
              />
              <div className="relative mt-2">
                {socialIcon5Preview ? (
                  <>
                    <img
                      src={socialIcon5Preview || '/placeholder.svg'}
                      alt="Preview"
                      className="h-32 max-w-xs rounded-lg border border-gray-300 object-contain"
                    />
                    <button
                      type="button"
                      onClick={removesocial_icon5}
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
              htmlFor="social_icon5_link"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Social Icon 5 Link
            </label>
            <input
              type="url"
              id="social_icon5_link"
              name="social_icon5_link"
              value={formData.social_icon5_link}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>

          <div className=" font-semibold- col-span-2 text-4xl">
            <h1>Title 1 Section</h1>
          </div>

          {/* Title 1 Section */}
          <div className="mb-5">
            <label
              htmlFor="title1"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 1
            </label>
            <input
              type="text"
              id="title1"
              name="title1"
              value={formData.title1}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="title1_subtitle"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 1 Subtitle
            </label>
            <input
              type="text"
              id="title1_subtitle"
              name="title1_subtitle"
              value={formData.title1_subtitle}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>

          {/* Repeat similar blocks for title1_link1_heading, title1_link1, title1_link2_heading, title1_link2, etc. up to title1_link6_heading and title1_link6 */}
          <div className="mb-5">
            <label
              htmlFor="title1_link1_heading"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 1 Link 1 Heading
            </label>
            <input
              type="text"
              id="title1_link1_heading"
              name="title1_link1_heading"
              value={formData.title1_link1_heading}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title1_link1"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 1 Link 1
            </label>
            <input
              type="text"
              id="title1_link1"
              name="title1_link1"
              value={formData.title1_link1}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="title1_link2_heading"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 1 Link 2 Heading
            </label>
            <input
              type="text"
              id="title1_link2_heading"
              name="title1_link2_heading"
              value={formData.title1_link2_heading}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title1_link2"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 1 Link 2
            </label>
            <input
              type="url"
              id="title1_link2"
              name="title1_link2"
              value={formData.title1_link2}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title1_link3_heading"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 1 Link 3 Heading
            </label>
            <input
              type="text"
              id="title1_link3_heading"
              name="title1_link3_heading"
              value={formData.title1_link3_heading}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title1_link3"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 1 Link 3
            </label>
            <input
              type="url"
              id="title1_link3"
              name="title1_link3"
              value={formData.title1_link3}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title1_link4_heading"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 1 Link 4 Heading
            </label>
            <input
              type="text"
              id="title1_link4_heading"
              name="title1_link4_heading"
              value={formData.title1_link4_heading}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title1_link4"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 1 Link 4
            </label>
            <input
              type="url"
              id="title1_link4"
              name="title1_link4"
              value={formData.title1_link4}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title1_link5_heading"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 1 Link 5 Heading
            </label>
            <input
              type="text"
              id="title1_link5_heading"
              name="title1_link5_heading"
              value={formData.title1_link5_heading}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title1_link5"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 1 Link 5
            </label>
            <input
              type="url"
              id="title1_link5"
              name="title1_link5"
              value={formData.title1_link5}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title1_link6_heading"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 1 Link 6 Heading
            </label>
            <input
              type="text"
              id="title1_link6_heading"
              name="title1_link6_heading"
              value={formData.title1_link6_heading}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title1_link6"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 1 Link 6
            </label>
            <input
              type="url"
              id="title1_link6"
              name="title1_link6"
              value={formData.title1_link6}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>

          <div className=" font-semibold- col-span-2 text-4xl">
            <h1> Title 2 Section </h1>
          </div>

          {/* Title 2 Section */}
          <div className="mb-5">
            <label
              htmlFor="title2"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 2
            </label>
            <input
              type="text"
              id="title2"
              name="title2"
              value={formData.title2}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title2_subtitle"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 2 Subtitle
            </label>
            <input
              type="text"
              id="title2_subtitle"
              name="title2_subtitle"
              value={formData.title2_subtitle}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title2_link1_heading"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 2 Link 1 Heading
            </label>
            <input
              type="text"
              id="title2_link1_heading"
              name="title2_link1_heading"
              value={formData.title2_link1_heading}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title2_link1"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 2 Link 1
            </label>
            <input
              type="url"
              id="title2_link1"
              name="title2_link1"
              value={formData.title2_link1}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title2_link2_heading"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 2 Link 2 Heading
            </label>
            <input
              type="text"
              id="title2_link2_heading"
              name="title2_link2_heading"
              value={formData.title2_link2_heading}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title2_link2"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 2 Link 2
            </label>
            <input
              type="url"
              id="title2_link2"
              name="title2_link2"
              value={formData.title2_link2}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title2_link3_heading"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 2 Link 3 Heading
            </label>
            <input
              type="text"
              id="title2_link3_heading"
              name="title2_link3_heading"
              value={formData.title2_link3_heading}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title2_link3"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 2 Link 3
            </label>
            <input
              type="url"
              id="title2_link3"
              name="title2_link3"
              value={formData.title2_link3}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title2_link4_heading"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 2 Link 4 Heading
            </label>
            <input
              type="text"
              id="title2_link4_heading"
              name="title2_link4_heading"
              value={formData.title2_link4_heading}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title2_link4"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 2 Link 4
            </label>
            <input
              type="url"
              id="title2_link4"
              name="title2_link4"
              value={formData.title2_link4}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>

          <div className=" font-semibold- col-span-2 text-4xl">
            <h1> Title 3 Section </h1>
          </div>

          {/* Title 3 Section */}
          <div className="mb-5">
            <label
              htmlFor="title3"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 3
            </label>
            <input
              type="text"
              id="title3"
              name="title3"
              value={formData.title3}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title3_subtitle"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 3 Subtitle
            </label>
            <input
              type="text"
              id="title3_subtitle"
              name="title3_subtitle"
              value={formData.title3_subtitle}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title3_link1_heading"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 3 Link 1 Heading
            </label>
            <input
              type="text"
              id="title3_link1_heading"
              name="title3_link1_heading"
              value={formData.title3_link1_heading}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title3_link1"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 3 Link 1
            </label>
            <input
              type="url"
              id="title3_link1"
              name="title3_link1"
              value={formData.title3_link1}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title3_link2_heading"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 3 Link 2 Heading
            </label>
            <input
              type="text"
              id="title3_link2_heading"
              name="title3_link2_heading"
              value={formData.title3_link2_heading}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title3_link2"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 3 Link 2
            </label>
            <input
              type="url"
              id="title3_link2"
              name="title3_link2"
              value={formData.title3_link2}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title3_link3_heading"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 3 Link 3 Heading
            </label>
            <input
              type="text"
              id="title3_link3_heading"
              name="title3_link3_heading"
              value={formData.title3_link3_heading}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title3_link3"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 3 Link 3
            </label>
            <input
              type="url"
              id="title3_link3"
              name="title3_link3"
              value={formData.title3_link3}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title3_link4_heading"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 3 Link 4 Heading
            </label>
            <input
              type="text"
              id="title3_link4_heading"
              name="title3_link4_heading"
              value={formData.title3_link4_heading}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="title3_link4"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Title 3 Link 4
            </label>
            <input
              type="url"
              id="title3_link4"
              name="title3_link4"
              value={formData.title3_link4}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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

export default Footer;

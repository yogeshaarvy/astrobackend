'use client';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addEditProducts,
  fetchSingleProducts,
  IProducts,
  updateProductsData
} from '@/redux/slices/store/productSlice';
import CustomReactSelect from '@/utils/CustomReactSelect';
import { fetchBrandList, IBrand } from '@/redux/slices/brandSlice';
import CustomTextEditor from '@/utils/CustomTextEditor';
import CustomTextField from '@/utils/CustomTextField';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { fetchCountriesList } from '@/redux/slices/countriesSlice';
import { fetchTagList } from '@/redux/slices/store/tagsSlice';
import { fetchTaxList } from '@/redux/slices/taxsSlice';
import { fetchCategoryList } from '@/redux/slices/store/categoriesSlice';
import CustomDropdown from '@/utils/CusomDropdown';
import { Switch } from '@/components/ui/switch';
import SimpleProductForm from './othercomponents/simpleproductsdrop';
import StockmanagmentProductForm from './othercomponents/stockmanagement';
import AttributesForm from './othercomponents/attributes';
import VariationsForm from './othercomponents/variations';

interface TabsState {
  general: boolean;
  attribute: boolean;
  variations: boolean;
}

export default function ProductsForm() {
  const router = useRouter();
  const params = useSearchParams();
  const entityId = params?.get('id');
  const dispatch = useAppDispatch();

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [secondMainImage, setSecondMainImage] = useState<File | null>(null);
  const [secondMainImagePreview, setSecondMainImagePreview] = useState<
    string | null
  >(null);
  const [otherImages, setOtherImages] = useState<File[]>([]);
  const [variations, setVariations] = useState<any[]>([]);
  const [generalTabData, setGeneralTabData] = useState({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [attributes, setAttributes] = useState<
    { type: string; values: string[] }[]
  >([]);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [tabsEnabled, setTabsEnabled] = useState<TabsState>({
    general: true,
    attribute: false,
    variations: false
  });

  const {
    singleProductsState: { loading, data: pData }
  } = useAppSelector((state) => state.productsdata);
  const {
    categoryListState: { loading: categoryListLoading, data: cData = [] }
  } = useAppSelector((state) => state.category);
  const {
    tagListState: { loading: tagListLoading, data: tagData = [] }
  } = useAppSelector((state) => state.tags);
  const {
    taxListState: { loading: taxListLoading, data: taxData = [] }
  } = useAppSelector((state) => state.taxsdata);
  const {
    brandListState: { loading: brandListLoading, data: bData = [] }
  } = useAppSelector((state) => state.brand);
  const {
    countriesListState: {
      loading: countryListLoading,
      data: canData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.countries);

  const form = useForm({
    defaultValues: {}
  });

  useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleProducts(entityId));
    }
  }, [entityId]);

  const brands: IBrand[] = bData;
  const page = 1;
  const pageSize = 100000;
  useEffect(() => {
    dispatch(fetchCountriesList({ page, pageSize }));
    dispatch(
      fetchTagList({
        page,
        pageSize,
        keyword: '',
        field: '',
        status: 'true',
        exportData: 'true'
      })
    );
    dispatch(
      fetchTaxList({
        page,
        pageSize,
        keyword: '',
        field: '',
        status: 'true',
        exportData: 'true'
      })
    );
    dispatch(
      fetchBrandList({
        page,
        pageSize,
        keyword: '',
        field: '',
        status: 'true',
        exportData: 'true'
      })
    );

    dispatch(
      fetchCategoryList({
        page,
        pageSize,
        keyword: '',
        field: '',
        status: 'true',
        exportData: 'true',
        entityId: ''
      })
    );
  }, [dispatch]);

  // Handle Single Image Upload
  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setMainImage(file);
    setMainImagePreview(file ? URL.createObjectURL(file) : null);
  };

  // Remove Main Image
  const handleRemoveMainImage = () => {
    setMainImage(null);
    setMainImagePreview(null);
  };

  const handleSecondMainImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    setSecondMainImage(file);
    setSecondMainImagePreview(file ? URL.createObjectURL(file) : null);
  };

  // Remove Second Main Image
  const handleRemoveSecondMainImage = () => {
    setSecondMainImage(null);
    setSecondMainImagePreview(null);
  };

  // Handle input change for multiple images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setOtherImages((prev) => [...prev, ...files]);

    // Generate image previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };
  // Remove an image from the list
  const handleRemoveImage = (index: number) => {
    setOtherImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Video File Upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
    setVideoFileName(file?.name || null);
  };
  const handleVariationsChange = (newVariations: any[]) => {
    setVariations(newVariations);
  };

  const handleSaveAttributes = (
    newAttributes: { type: any; values: string[] }[]
  ) => {
    setAttributes(newAttributes);
  };

  const handleSaveSettings = () => {
    const formData = pData; // Get current form data
    console.log('formData in handle Save Setting', formData);
    const productype = formData?.productype; // Get the product type
    const stockManagementEnabled = formData?.stockManagement;
    const stockManagementLevel =
      formData?.stockManagement?.stock_management_level;
    let requiredFields: string[] = [];

    // Validation: Ensure Simple Product Fields are filled if product type is "simpleproduct"
    if (productype === 'simpleproduct') {
      requiredFields = [
        'price',
        'special_price',
        'weight',
        'height',
        'breadth',
        'length'
      ];
      // Additional required fields if stock management is enabled
      if (stockManagementEnabled) {
        requiredFields.push('stock_value');
      }
    }
    // Required field for Variable Product if stock management is enabled
    if (productype === 'variableproduct' && stockManagementEnabled) {
      requiredFields.push('stock_management_level');
    }
    // If stock management level is "product_level", require stock_value and stock_status
    if (stockManagementLevel === 'product_level') {
      requiredFields.push('stock_value');
    }
    const missingFields = requiredFields.filter(
      (field) => !formData[field] // Check for empty or undefined fields
    );

    if (missingFields.length > 0) {
      toast.error(`Missing  fields required: ${missingFields.join(', ')}`);
      return;
    }
    const extractedData: Partial<IProducts> = {
      productype,
      simpleProduct:
        productype === 'simpleproduct'
          ? {
              price: formData?.price,
              special_price: formData?.special_price,
              weight: formData?.weight,
              height: formData?.height,
              breadth: formData?.breadth,
              length: formData?.length
            }
          : {}, // Only save Simple Product Fields if the product type is "simpleproduct"
      stockManagement: {
        stockManagement: formData?.stockManagement,
        stock_value: formData?.stockManagement?.stock_value,
        stock_status: formData?.stock_status,
        stock_management_level:
          formData?.stockManagement?.stock_management_level
      }
    };
    if (activeTab === 'general') {
      setGeneralTabData(extractedData); // Save data specific to General tab
    }

    // Enable the "Attribute" and "Variations" tabs after saving settings
    setTabsEnabled((prev) => ({
      ...prev,
      attribute: true,
      variations: true
    }));
    // Mark settings as saved
    setSettingsSaved(true);

    toast.success('Settings saved successfully!');
  };

  const handleTabChange = (tab: keyof TabsState) => {
    if (tabsEnabled[tab]) {
      setActiveTab(tab);
    }
  };

  const handleDropdownChange = (e: any) => {
    const { name, value } = e;
    dispatch(
      updateProductsData({ [name]: value }) // .then(handleReduxResponse());
    );
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    console.log('name, vlaue', name, value);
    dispatch(
      updateProductsData({
        [name]:
          type === 'file'
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
    // Validate required fields
    let missingFields: string[] = [];
    let categoriesdata =
      pData?.categories?.length > 0
        ? pData?.categories
        : pData?.categories ?? [];
    let brand_namedata = pData?.brand_name || pData?.brand_name || ''; // Retain brand
    let madeIndata = pData?.madeIn || pData?.madeIn || ''; // Retain madeIn
    let tagsdata = pData?.tags || pData?.tags || ''; // Retain tag
    let taxdata = pData?.tax || pData?.tax || ''; // Retain tag
    // Check required fields and add their names to missingFields array if missing
    if (!pData?.name) missingFields.push('Name');
    if (!pData?.model_no) missingFields.push('Model Number');
    if (!pData?.productype) missingFields.push('Product Type');
    if (!brand_namedata) missingFields.push('Brand Name');
    if (!madeIndata) missingFields.push('Made In');
    if (!pData?.meta_title) missingFields.push('Meta Title');
    if (!pData?.meta_description) missingFields.push('Meta Description');
    if (!pData?.description) missingFields.push('Description');
    if (!pData?.meta_tag) missingFields.push('Meta Tag');
    if (!tagsdata) missingFields.push('Tags');
    if (!taxdata) missingFields.push('Tax');
    if (!pData?.hsn_code) missingFields.push('HSN Code');
    if (!pData?.sku) missingFields.push('SKU');
    if (!pData?.manufacture) missingFields.push('Manufacture');
    if (!categoriesdata?.length) missingFields.push('Categories');
    // if (!mainImage) missingFields.push('Main Image');
    // if (!secondMainImage) missingFields.push('Second Main Image');
    // If any fields are missing, show an error message with the field names
    if (missingFields.length > 0) {
      toast.error(
        `The following fields are required: ${missingFields.join(', ')}`
      );
      return;
    }
    // If product type is variable, ensure at least one attribute is selected
    if (
      pData?.productype === 'variableproduct' &&
      (!attributes || attributes.length === 0)
    ) {
      toast.error('At least one attribute is required for variable products');
      return;
    }
    // Validate video pData? if videotype is selected
    if (pData?.videotype && !pData?.videodata) {
      toast.error('Video pData? is required when video type is selected');
      return;
    }
    // Validate video pData? based on videotype
    if (pData?.videotype) {
      if (pData?.videotype === 'selfhosted' && !videoFile) {
        toast.error('Video file is required for self-hosted videos');
        return;
      } else if (pData?.videotype !== 'selfhosted' && !pData?.videodata) {
        toast.error('Video pData? is required when video type is selected');
        return;
      }
    }
    //valide varitions required
    if (variations?.length > 0) {
      let isValid = true;
      let variationErrors: string[] = [];

      variations.forEach((variation, index) => {
        let missingVariationFields: string[] = [];

        if (!variation.price) missingVariationFields.push('Price');
        if (!variation.special_price)
          missingVariationFields.push('Special Price');
        if (!variation.weight) missingVariationFields.push('Weight');
        if (!variation.height) missingVariationFields.push('Height');
        if (!variation.breadth) missingVariationFields.push('Breadth');
        if (!variation.length) missingVariationFields.push('Length');
        if (!variation.sku) missingVariationFields.push('SKU');
        if (!variation.image) missingVariationFields.push('Image');

        if (
          generalTabData?.stockManagement?.stock_management_level ===
          'variable_level'
        ) {
          if (!variation.totalStock) missingVariationFields.push('Total Stock');
          if (!variation.stock_status)
            missingVariationFields.push('Stock Status');
        }

        if (missingVariationFields.length > 0) {
          isValid = false;
          variationErrors.push(
            `Variation ${index + 1}: ${missingVariationFields.join(', ')}`
          );
        }
      });

      if (!isValid) {
        toast.error(
          `Please fill in the required fields for variations:\n${variationErrors.join(
            '\n'
          )}`
        );
        return;
      }
    }

    const finalVideoData =
      pData?.videotype === 'selfmadevideo' ? videoFile : pData?.videodata; // Use videodata from the form for Vimeo/YouTube

    let finalVariations = variations;
    if (pData?.productype === 'simpleproduct') {
      finalVariations = [
        {
          ...generalTabData?.simpleProduct,
          values: [] // Add any necessary values here
        }
      ];
    }
    const uploadImageAndUpdate = async () => {
      for (let i = 0; i < finalVariations.length; i++) {
        const item = finalVariations[i];
        const formData = new FormData();

        if (item.image) {
          const fileType = item?.image?.type?.startsWith('image/')
            ? 'imagefile'
            : item?.image?.type?.startsWith('audio/')
            ? 'audiofile'
            : 'file';

          formData.append(fileType, item?.image);

          try {
            const response = await fetchApi('/files', {
              method: 'POST',
              body: formData
            });

            // Update the finalVariations array with the response pData?
            finalVariations[i] = {
              ...item,
              image: response?.result?.imageFileUrl
            };
          } catch (error) {
            console.error('Error uploading file:', error);
          }
        }
      }
    };

    await uploadImageAndUpdate();

    const attributesToSave = attributes.map((attr: any) => ({
      type: attr?.type?._id,
      values: attr?.values.map((value: any) => value?._id)
    }));
    dispatch(
      updateProductsData({
        ...(pData ?? {}), // Ensure pData is not null
        ...pData, // Override with new values
        brand_name: brand_namedata, // Retain brand
        madeIn: madeIndata, // Retain madeIn
        tags: tagsdata, // Retain tag
        tax: taxdata, // Retain tag
        categories: categoriesdata,
        variations: finalVariations, // Stringify variations pData?
        main_image: mainImage ?? '',
        second_main_image: secondMainImage ?? '',
        videodata: finalVideoData ?? '',
        attributes: attributesToSave, // Send only IDs to API
        other_image: otherImages ?? [], // Add selected images to form data
        stockManagement: generalTabData?.stockManagement
      })
    );

    dispatch(addEditProducts(null)).then((response: any) => {
      if (!response?.error) {
        router.push('/dashboard/store/products');
        toast.success(response?.payload?.message);
      } else {
        toast.error(response.payload);
      }
    });
  };

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Products Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <Tabs defaultValue="English" className="mt-4 w-full">
                <TabsList className="flex w-full space-x-2 p-0">
                  <TabsTrigger
                    value="English"
                    className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                  >
                    English
                  </TabsTrigger>
                  <TabsTrigger
                    value="Hindi"
                    className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
                  >
                    Hindi
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="English">
                  <CardHeader className="!px-0">
                    <CardTitle className="text-lg font-bold ">
                      ENGLISH-PRODUCT
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-0">
                    <CustomTextField
                      name="title.en"
                      label="Title*"
                      placeholder="Enter title"
                      value={(pData as IProducts)?.title?.en}
                      onChange={handleInputChange}
                    />

                    <CustomTextField
                      name="manufacture.en"
                      label="Manufacture*"
                      placeholder="Enter manufacture"
                      value={(pData as IProducts)?.manufacture?.en}
                      onChange={handleInputChange}
                    />

                    <CustomTextEditor
                      name="description.en"
                      label="Full Description"
                      value={(pData as IProducts)?.description?.en}
                      onChange={(value) =>
                        handleInputChange({
                          target: {
                            name: 'description.en',
                            value: value,
                            type: 'text'
                          }
                        })
                      }
                    />
                  </CardContent>
                </TabsContent>

                <TabsContent value="Hindi">
                  <CardHeader className="!px-0">
                    <CardTitle className="text-lg font-bold ">
                      HINDI-PRODUCT
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-0">
                    <CustomTextField
                      name="title.hi"
                      label="Tilte*"
                      placeholder="Enter Title"
                      value={(pData as IProducts)?.title?.hi}
                      onChange={handleInputChange}
                    />

                    <CustomTextField
                      name="manufacture.hi"
                      label="Manufacture*"
                      placeholder="Enter manufacture"
                      value={(pData as IProducts)?.manufacture?.hi}
                      onChange={handleInputChange}
                    />

                    <CustomTextEditor
                      name="description.hi"
                      label="Full Description"
                      value={(pData as IProducts)?.description?.hi}
                      onChange={(value) =>
                        handleInputChange({
                          target: {
                            name: 'description.hi',
                            value: value,
                            type: 'text'
                          }
                        })
                      }
                    />
                  </CardContent>
                </TabsContent>
              </Tabs>

              <CustomTextField
                name="name"
                label="Name*"
                placeholder="Enter name"
                value={(pData as IProducts)?.name}
                onChange={handleInputChange}
              />

              <CustomTextField
                name="model_no"
                label="Model No.*"
                placeholder="Enter model number"
                value={(pData as IProducts)?.model_no}
                onChange={handleInputChange}
                type="text"
              />
              <CustomTextField
                name="meta_tag"
                label="Meta Tag*"
                placeholder="Enter your meta tag"
                value={(pData as IProducts)?.meta_tag}
                onChange={handleInputChange}
              />
              <CustomTextField
                name="meta_description"
                label="Meta Description*"
                placeholder="Enter your meta description"
                value={(pData as IProducts)?.meta_description}
                onChange={handleInputChange}
              />
              <CustomTextField
                label="Meta Title*"
                name="meta_title"
                placeholder="Enter meta title"
                onChange={handleInputChange}
                value={(pData as IProducts)?.meta_title}
              />
              <CustomTextField
                name="sequence"
                label="Sequence*"
                placeholder="Enter your sequence"
                value={(pData as IProducts)?.sequence}
                onChange={handleInputChange}
                type="number"
              />
              <CustomReactSelect
                options={brands}
                label="Brand Name*"
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option._id}
                placeholder="Select Brand"
                onChange={(e: any) =>
                  handleInputChange({
                    target: { name: 'brand_name', value: e }
                  })
                }
                value={(pData as IProducts)?.brand_name}
              />

              <CustomReactSelect
                options={canData}
                label="Made In*"
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option._id}
                placeholder="Select Country"
                onChange={(e: any) =>
                  handleInputChange({
                    target: { name: 'madeIn', value: e }
                  })
                }
                value={(pData as IProducts)?.madeIn}
              />
              <CustomReactSelect
                options={cData}
                isMulti
                label="Categories*"
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option._id}
                placeholder="Select Categories"
                onChange={(e: any) =>
                  handleInputChange({
                    target: { name: 'categories', value: e }
                  })
                }
                value={(pData as IProducts)?.categories}
              />
              <CustomReactSelect
                options={tagData}
                label="Tags*"
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option._id}
                placeholder="Select Tags"
                onChange={(e: any) =>
                  handleInputChange({
                    target: { name: 'tags', value: e }
                  })
                }
                value={(pData as IProducts)?.tags}
              />
              <CustomReactSelect
                options={taxData}
                label="Tax*"
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option._id}
                placeholder="Select Tax"
                onChange={(e: any) =>
                  handleInputChange({
                    target: { name: 'tax', value: e }
                  })
                }
                value={(pData as IProducts)?.tax}
              />
              <CustomTextField
                label="HSN code*"
                name="hsn_code"
                placeholder="Enter HSN Code"
                onChange={handleInputChange}
                value={(pData as IProducts)?.hsn_code}
              />
              <CustomTextField
                label="SKU*"
                name="sku"
                placeholder="Enter SKU "
                onChange={handleInputChange}
                value={(pData as IProducts)?.sku}
              />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomDropdown
                  // control={form.control}
                  label="Is Return"
                  name="return_able"
                  required={true}
                  value={(pData as IProducts)?.return_able}
                  defaultValue={(pData as IProducts)?.return_able || 'false'}
                  data={[
                    { name: 'True', _id: 'true' },
                    { name: 'False', _id: 'false' }
                  ]}
                  onChange={(value) =>
                    handleInputChange({
                      target: {
                        name: 'return_able',
                        value: value.value
                      }
                    })
                  }
                />
                {(pData as IProducts)?.return_able && (
                  <CustomTextField
                    label="Number of days"
                    name="number_of_days"
                    placeholder="Enter Number of days"
                    onChange={handleInputChange}
                    value={(pData as IProducts)?.number_of_days}
                    type="number"
                  />
                )}
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomDropdown
                  // control={form.control}
                  label="Is Cancle"
                  name="if_cancel"
                  required={true}
                  value={(pData as IProducts)?.if_cancel}
                  defaultValue={(pData as IProducts)?.if_cancel || 'false'}
                  data={[
                    { name: 'True', _id: 'true' },
                    { name: 'False', _id: 'false' }
                  ]}
                  onChange={(value) =>
                    handleInputChange({
                      target: {
                        name: 'if_cancel',
                        value: value.value
                      }
                    })
                  }
                />
                {(pData as IProducts)?.if_cancel && (
                  <CustomTextField
                    label="Number Of Days"
                    name="cancel_days"
                    placeholder="Enter Number of days"
                    onChange={handleInputChange}
                    value={(pData as IProducts)?.cancel_days}
                    type="number"
                  />
                )}
              </div>
              <div className="flex items-center gap-3">
                <CardTitle>Is COD Available?</CardTitle>
                <Switch
                  className="!m-0"
                  checked={(pData as IProducts)?.is_cod_allowed}
                  // onCheckedChange={handleToggle}
                  onCheckedChange={(checked: any) =>
                    handleInputChange({
                      target: {
                        type: 'checkbox',
                        name: 'is_cod_allowed',
                        checked
                      }
                    })
                  }
                  aria-label="Toggle Active Status"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Main Image*
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageUpload}
                  className="file:bg-black-100 hover:file:bg-black-100 block text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-500"
                />
                {mainImagePreview && (
                  <div
                    className="relative mt-4"
                    style={{
                      display: 'flex',
                      right: '650px',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <img
                      src={mainImagePreview}
                      alt="Main Preview"
                      className="h-32 w-32 rounded-md border object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveMainImage}
                      className="absolute right-0 top-0 rounded-full bg-white p-1 text-red-500 shadow-md"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Second Main Image*
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSecondMainImageUpload}
                  className="file:bg-black-100 hover:file:bg-black-100 block text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-500"
                />
                {secondMainImagePreview && (
                  <div
                    className="relative mt-4"
                    style={{
                      display: 'flex',
                      right: '650px',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <img
                      src={secondMainImagePreview}
                      alt="Main Preview"
                      className="h-32 w-32 rounded-md border object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveSecondMainImage}
                      className="absolute right-0 top-0 rounded-full bg-white p-1 text-red-500 shadow-md"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Other Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="file:bg-black-100 hover:file:bg-black-100 block text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-500"
                />
                <div className="mt-4 flex flex-wrap gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-20 w-20 rounded-md border object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute right-0 top-0 rounded-full bg-white p-1 text-red-500 shadow-md"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomDropdown
                  label="Video Type"
                  name="videotype"
                  // placeholder="Select Video Type"
                  required={true}
                  value={(pData as IProducts)?.videotype}
                  defaultValue={(pData as IProducts)?.videotype || 'none'}
                  data={[
                    { name: 'None', _id: 'none' },
                    { name: 'Self Hosted', _id: 'selfmadevideo' },
                    { name: 'Vimeo ', _id: 'vimeovideo' },
                    { name: 'YouTube', _id: 'youtubvideo' }
                  ]}
                  onChange={(value) =>
                    handleInputChange({
                      target: {
                        name: 'videotype',
                        value: value.value
                      }
                    })
                  }
                />
                {(pData as IProducts)?.videotype === 'selfmadevideo' && (
                  <div>
                    <label className="mt-2 block text-sm font-medium text-gray-700">
                      Upload Video*
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      className="file:bg-black-100 hover:file:bg-black-100 block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gray-500"
                      onChange={handleVideoUpload}
                    />
                    {videoFileName && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-700">{videoFileName}</p>
                      </div>
                    )}
                  </div>
                )}
                {(pData as IProducts)?.videotype === 'vimeovideo' && (
                  <CustomTextField
                    label=" Upload Video*"
                    name="videodata"
                    placeholder="Enter Vimeo video URL"
                    onChange={handleInputChange}
                    value={(pData as IProducts)?.videodata}
                    type="url"
                  />
                )}
                {(pData as IProducts)?.videotype === 'youtubvideo' && (
                  <CustomTextField
                    label="Upload Video*"
                    name="videodata"
                    placeholder="Enter YouTube video URL"
                    onChange={handleInputChange}
                    value={(pData as IProducts)?.videodata}
                    type="url"
                  />
                )}
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomDropdown
                  label="Maximum Order"
                  name="maxorder"
                  required={true}
                  value={(pData as IProducts)?.maxorder}
                  defaultValue={(pData as IProducts)?.maxorder || 'false'}
                  data={[
                    { name: 'True', _id: 'true' },
                    { name: 'False', _id: 'false' }
                  ]}
                  onChange={(value) =>
                    handleInputChange({
                      target: {
                        name: 'maxorder',
                        value: value.value
                      }
                    })
                  }
                />
                {(pData as IProducts)?.maxorder && (
                  <CustomTextField
                    label="Maximum Order Value"
                    name="maxorder_value"
                    placeholder="Enter maximum order value"
                    onChange={handleInputChange}
                    value={(pData as IProducts)?.maxorder_value}
                    type="number"
                  />
                )}
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomDropdown
                  label="Minimum Order"
                  name="minorder"
                  required={true}
                  value={(pData as IProducts)?.minorder}
                  defaultValue={(pData as IProducts)?.minorder || 'false'}
                  data={[
                    { name: 'True', _id: 'true' },
                    { name: 'False', _id: 'false' }
                  ]}
                  onChange={(value) =>
                    handleInputChange({
                      target: {
                        name: 'minorder',
                        value: value.value
                      }
                    })
                  }
                />
                {(pData as IProducts)?.minorder && (
                  <CustomTextField
                    label="Minimum Order Value"
                    name="minorder_value"
                    placeholder="Enter maximum order value"
                    onChange={handleInputChange}
                    value={(pData as IProducts)?.minorder_value}
                    type="number"
                  />
                )}
              </div>

              {/* Testing */}

              <div className="">
                <h4 className="py-2">Additional Info</h4>
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    type="button"
                    onClick={() => handleTabChange('general')}
                    className={`border border-gray-900 px-4 py-2 text-sm font-medium ${
                      activeTab === 'general'
                        ? 'bg-gray-900 text-white'
                        : 'bg-transparent text-gray-900 hover:bg-gray-900 hover:text-white'
                    }`}
                  >
                    General
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange('attribute')}
                    disabled={!tabsEnabled.attribute}
                    className={`border border-gray-900 px-4 py-2 text-sm font-medium ${
                      tabsEnabled.attribute
                        ? activeTab === 'attribute'
                          ? 'bg-gray-900 text-white'
                          : 'bg-transparent text-gray-900 hover:bg-gray-900 hover:text-white'
                        : 'cursor-not-allowed bg-transparent text-gray-500'
                    }`}
                  >
                    Attribute
                  </button>
                  {(pData as IProducts)?.productype === 'variableproduct' &&
                    tabsEnabled.variations && (
                      <button
                        type="button"
                        onClick={() => handleTabChange('variations')}
                        disabled={!tabsEnabled.variations}
                        className={`border border-gray-900 px-4 py-2 text-sm font-medium ${
                          tabsEnabled.variations
                            ? activeTab === 'variations'
                              ? 'bg-gray-900 text-white'
                              : 'bg-transparent text-gray-900 hover:bg-gray-900 hover:text-white'
                            : 'cursor-not-allowed bg-transparent text-gray-500'
                        }`}
                      >
                        Variations
                      </button>
                    )}
                </div>
                {activeTab === 'general' && (
                  <>
                    <CustomDropdown
                      label="Type of Product"
                      name="productype"
                      required={true}
                      value={(pData as IProducts)?.productype}
                      defaultValue={(pData as IProducts)?.productype || ''}
                      data={[
                        { name: 'Simple Product', _id: 'simpleproduct' },
                        { name: 'Variable Product', _id: 'variableproduct' }
                      ]}
                      disabled={settingsSaved}
                      onChange={(value) =>
                        handleInputChange({
                          target: {
                            name: 'productype',
                            value: value.value
                          }
                        })
                      }
                    />
                    {(pData as IProducts)?.productype === 'simpleproduct' && (
                      <SimpleProductForm
                        handleInputChange={handleInputChange}
                        disabled={settingsSaved}
                        entityId={entityId}
                        pData={pData}
                      />
                    )}
                    {((pData as IProducts)?.productype === 'simpleproduct' ||
                      (pData as IProducts)?.productype ===
                        'variableproduct') && (
                      <StockmanagmentProductForm
                        handleInputChange={handleInputChange}
                        handleDropdownChange={handleDropdownChange}
                        producttype={(pData as IProducts)?.productype}
                        disabled={settingsSaved}
                      />
                    )}

                    {((pData as IProducts)?.productype === 'simpleproduct' ||
                      (pData as IProducts)?.productype ===
                        'variableproduct') && (
                      <Button
                        type="button"
                        onClick={handleSaveSettings}
                        className="border-white-900 my-4 border bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 hover:text-white focus:z-10 focus:bg-blue-900 focus:text-white "
                        disabled={settingsSaved} // Disable button if settings are saved
                      >
                        Save Settings
                      </Button>
                    )}
                  </>
                )}
                {activeTab === 'attribute' && (
                  <div className="mt-4">
                    <AttributesForm
                      onSaveAttributes={handleSaveAttributes}
                      pData={pData}
                    />
                  </div>
                )}
                {activeTab === 'variations' && (
                  <div className="mt-4">
                    <VariationsForm
                      newAttributes={attributes}
                      stockmanagemet={
                        generalTabData?.stockManagement
                          ?.stock_management_level || ''
                      }
                      handleInputChange={handleInputChange}
                      onVariationsChange={handleVariationsChange} // Pass the handler to VariationsForm
                      pData={pData}
                    />
                  </div>
                )}
              </div>

              {/* testing Close  */}
            </form>
          </Form>
        </CardContent>
        <CardFooter
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}
        >
          <Button type="submit" onClick={() => handleSubmit()}>
            Submit
          </Button>
        </CardFooter>
      </Card>
    </PageContainer>
  );
}

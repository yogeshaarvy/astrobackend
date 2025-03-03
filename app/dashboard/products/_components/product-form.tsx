'use client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PageContainer from '@/components/layout/page-container';
import {
  updateProductsData,
  setProductsData,
  IProducts,
  addEditProducts,
  fetchSingleProducts
} from '@/redux/slices/productSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import CustomTextField from '@/utils/CustomTextField';
import { useRouter, useSearchParams } from 'next/navigation';

import { toast } from 'sonner';
import slugify from 'slugify';
import CustomDropdown from '@/utils/CusomDropdown';
import { fetchBrandList, IBrand } from '@/redux/slices/brandSlice';
import { fetchCategoryList } from '@/redux/slices/categoriesSlice';
import { fetchCountriesList } from '@/redux/slices/countriesSlice';
import { fetchTaxList } from '@/redux/slices/taxsSlice';
import { fetchTagList } from '@/redux/slices/tagsSlice';
import SimpleProductForm from '../_components/othercomponents/simpleproductsdrop';
import StockmanagmentProductForm from './othercomponents/stockmanagement';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS
import AttributesForm from './othercomponents/attributes';
import VariationsForm from './othercomponents/variations';
import CustomReactSelect from '@/utils/CustomReactSelect';

export default function ProductsForm() {
  const router = useRouter();
  const params = useSearchParams();
  const entityId = params?.get('id');
  const dispatch = useAppDispatch();
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

  const [attributes, setAttributes] = React.useState<
    { type: string; values: string[] }[]
  >([]);
  // This will handle saving the selected attributes from AttributesForm
  const handleSaveAttributes = (
    newAttributes: { type: any; values: string[] }[]
  ) => {
    setAttributes(newAttributes); // Store the selected attributes (type + values) in the parent
  };
  const {
    countriesListState: {
      loading: countryListLoading,
      data: canData = [],
      pagination: { totalCount }
    }
  } = useAppSelector((state) => state.countries);
  const form = useForm<IProducts>({
    defaultValues: {
      name: '',
      slug: '',
      model_no: '',
      main_image: '',
      other_image: [],
      brand_name: '',
      sequence: 0,
      price: 0,
      special_price: 0,
      // filtertypes: [],
      // filtervalues: [],
      categories: [],
      active: false,
      meta_tag: '',
      meta_description: '',
      meta_title: '',
      madeIn: '',
      productype: '',
      simpleProduct: {
        price: 0,
        special_price: 0,
        weight: 0,
        height: 0,
        breadth: 0,
        length: 0
      },
      videotype: '',
      tax: '',
      tags: '',
      maxorder: '',
      maxorder_value: 0,
      minorder: '',
      minorder_value: 0,
      hsn_code: '',
      return_able: '',
      number_of_days: 0,
      if_cancel: '',
      cancel_days: 0,
      videodata: '',
      sku: '',
      is_cod_allowed: false,
      // stock_management: false,
      description: '',
      stockManagement: {
        stock_management: false,
        stock_value: 0,
        // sku: '',
        stock_status: 'true',
        stock_management_level: ''
      }
    }
  });

  const [otherImages, setOtherImages] = React.useState<File[]>([]); // State for storing selected images
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([]); // State for image previews
  const [mainImage, setMainImage] = React.useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = React.useState<string | null>(
    null
  );
  const [videoFile, setVideoFile] = React.useState<File | null>(null);
  const [videoFileName, setVideoFileName] = React.useState<string | null>(null);

  const [activeTab, setActiveTab] = React.useState('general'); // Default to 'General'

  const [tabsEnabled, setTabsEnabled] = React.useState({
    general: true, // "General" is always enabled
    attribute: false, // Initially disabled
    variations: false // Initially disabled
  });
  const [generalTabData, setGeneralTabData] = React.useState({});
  // State to track whether settings are saved
  const [settingsSaved, setSettingsSaved] = React.useState(false); // State to store data specific to the "Additional Information" section

  const [variations, setVariations] = React.useState<any[]>([]); // State to store variations data
  const handleTabChange = (tab: any) => {
    if (tabsEnabled[tab]) {
      setActiveTab(tab);
    }
  };

  const handleSaveSettings = () => {
    const formData = form.getValues(); // Get current form data
    const productype = formData.productype; // Get the product type
    const stockManagementEnabled = formData.stock_management;
    const stockManagementLevel = formData.stock_management_level;
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
        stock_management: formData.stock_management,
        stock_value: formData.stock_value,
        // sku: formData.sku,
        stock_status: formData.stock_status,
        stock_management_level: formData.stock_management_level
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

  // Handle Video File Upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setVideoFile(file);
    setVideoFileName(file?.name || null);
  };

  // Remove Video File
  const handleRemoveVideoFile = () => {
    setVideoFile(null);
    setVideoFileName(null);
  };

  const {
    brandListState: { loading: brandListLoading, data: bData = [] }
  } = useAppSelector((state) => state.brand);

  const page = 1;
  const pageSize = 100000;

  React.useEffect(() => {
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
  }, [dispatch]); // Ensure this is run only once when the component

  React.useEffect(() => {
    if (entityId) {
      dispatch(fetchSingleProducts(entityId));
    }
  }, [entityId]);

  React.useEffect(() => {
    if (pData && entityId) {
      form.setValue('name', pData?.name || '');
      form.setValue('slug', pData?.slug || '');
      form.setValue('sequence', pData?.sequence || 0);
      form.setValue('categories', pData?.categories || []); // Set 'categories' as an array
      form.setValue('manufacture', pData?.manufacture || '');
      form.setValue('meta_title', pData?.meta_title || '');
      form.setValue('meta_description', pData.meta_description || '');
      form.setValue('meta_tag', pData?.meta_tag || '');
      form.setValue('brand_name', pData?.brand_name || '');
      form.setValue('madeIn', pData?.madeIn || '');
      form.setValue('productype', pData?.productype || '');
      form.setValue('videotype', pData?.videotype || '');
      form.setValue('tags', pData?.tags || '');
      form.setValue('tax', pData?.tax || '');
      form.setValue('maxorder', pData?.maxorder || 'false');
      form.setValue('minorder', pData?.minorder || 'false');
      form.setValue('minorder_value', pData?.maxorder_value || 0);
      form.setValue('maxorder_value', pData?.maxorder_value || 0);
      form.setValue('hsn_code', pData?.hsn_code || '');
      form.setValue('sku', pData?.sku || '');
      form.setValue('return_able', pData?.return_able || 'false');
      form.setValue('number_of_days', pData?.number_of_days || 0);
      form.setValue('if_cancel', pData?.if_cancel || 'false');
      form.setValue('cancel_days', pData?.cancel_days || 0);
      form.setValue('videodata', pData?.videodata || '');
      form.setValue('description', pData?.description || '');
      form.setValue('is_cod_allowed', pData?.is_cod_allowed || false); // Initialize the checkbox

      // Set initial state for images
      setMainImagePreview(pData?.main_image || null);
      setOtherImages(pData?.other_image || []);
      setImagePreviews(pData?.other_image?.map((img: string) => img) || []);
      setSettingsSaved(true);
      setTabsEnabled((prev) => ({
        ...prev,
        attribute: true,
        variations: true
      }));
    }
  }, [pData, entityId, form]);

  // Handle Input Change
  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;

    dispatch(
      updateProductsData({
        [name]:
          type === 'file'
            ? files?.[0]
            : type === 'checkbox'
            ? checked
            : type === 'number'
            ? Number(value)
            : value
      })
    );
  };

  // Handle variations change
  const handleVariationsChange = (newVariations: any[]) => {
    setVariations(newVariations);
  };

  const onSubmit = (data: any) => {
    // Validate required fields
    let missingFields: string[] = [];

    let categoriesdata =
      data.categories?.length > 0 ? data.categories : pData?.categories ?? [];
    let brand_namedata = data.brand_name || pData?.brand_name || ''; // Retain brand
    let madeIndata = data.madeIn || pData?.madeIn || ''; // Retain madeIn
    let tagsdata = data.tags || pData?.tags || ''; // Retain tag
    let taxdata = data.tax || pData?.tax || ''; // Retain tag

    // Check required fields and add their names to missingFields array if missing
    if (!data.name) missingFields.push('Name');
    if (!data.slug) missingFields.push('Slug');
    if (!data.model_no) missingFields.push('Model Number');
    if (!data.productype) missingFields.push('Product Type');
    if (!brand_namedata) missingFields.push('Brand Name');
    if (!madeIndata) missingFields.push('Made In');
    if (!data.meta_title) missingFields.push('Meta Title');
    if (!data.meta_description) missingFields.push('Meta Description');
    if (!data.description) missingFields.push('Description');
    if (!data.meta_tag) missingFields.push('Meta Tag');
    if (!tagsdata) missingFields.push('Tags');
    if (!taxdata) missingFields.push('Tax');
    if (!data.hsn_code) missingFields.push('HSN Code');
    if (!data.sku) missingFields.push('SKU');
    if (!data.manufacture) missingFields.push('Manufacture');
    if (!categoriesdata?.length) missingFields.push('Categories');
    if (!mainImage) missingFields.push('Main Image');
    // If any fields are missing, show an error message with the field names
    if (missingFields.length > 0) {
      toast.error(
        `The following fields are required: ${missingFields.join(', ')}`
      );
      return;
    }

    // If product type is variable, ensure at least one attribute is selected
    if (
      data.productype === 'variableproduct' &&
      (!attributes || attributes.length === 0)
    ) {
      toast.error('At least one attribute is required for variable products');
      return;
    }
    // Validate video data if videotype is selected
    if (data.videotype && !data.videodata) {
      toast.error('Video data is required when video type is selected');
      return;
    }
    // Validate video data based on videotype
    if (data.videotype) {
      if (data.videotype === 'selfhosted' && !videoFile) {
        toast.error('Video file is required for self-hosted videos');
        return;
      } else if (data.videotype !== 'selfhosted' && !data.videodata) {
        toast.error('Video data is required when video type is selected');
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

    //   variations.forEach((variation, index) => {
    //     if (
    //       !variation.price ||
    //       !variation.special_price ||
    //       !variation.weight ||
    //       !variation.height ||
    //       !variation.breadth ||
    //       !variation.length
    //     ) {
    //       isValid = false;
    //     }

    //     if (
    //       generalTabData?.stockManagement?.stock_management_level ===
    //       'variable_level'
    //     ) {
    //       if (!variation.totalStock) {
    //         isValid = false;
    //       }
    //     }
    //   });

    //   if (!isValid) {
    //     toast.error('All variation fields are required!');
    //     return;
    //   }
    // }

    const finalVideoData =
      data.videotype === 'selfmadevideo' ? videoFile : data.videodata; // Use videodata from the form for Vimeo/YouTube

    let finalVariations = variations;
    if (data.productype === 'simpleproduct') {
      finalVariations = [
        {
          ...generalTabData?.simpleProduct,
          values: [] // Add any necessary values here
        }
      ];
    }
    const attributesToSave = attributes.map((attr: any) => ({
      type: attr?.type?._id,
      values: attr?.values.map((value: any) => value?._id)
    }));
    dispatch(
      updateProductsData({
        ...(pData ?? {}), // Ensure pData is not null
        ...data, // Override with new values
        brand_name: brand_namedata, // Retain brand
        madeIn: madeIndata, // Retain madeIn
        tags: tagsdata, // Retain tag
        tax: taxdata, // Retain tag
        categories: categoriesdata,
        variations: JSON.stringify(finalVariations), // Stringify variations data
        main_image: mainImage ?? '',
        videodata: finalVideoData ?? '',
        attributes: JSON.stringify(attributesToSave), // Send only IDs to API
        other_image: otherImages ?? [], // Add selected images to form data
        stockManagement: generalTabData?.stockManagement
      })
    );

    dispatch(addEditProducts(entityId || null))
      .then((response: any) => {
        if (response.payload.success) {
          // router.push('/dashboard/products');
          toast.success(response.payload.message);
        }
      })
      .catch((err: any) => toast.error('Error:', err));
  };
  React.useEffect(() => {
    const name = form.watch('name'); // Watch for changes in the 'name' field
    if (name) {
      const generatedSlug = slugify(name, {
        lower: true, // Converts to lowercase
        strict: true, // Removes special characters
        trim: true // Trims whitespace
      });

      form.setValue('slug', generatedSlug);
      dispatch(updateProductsData({ ['slug']: generatedSlug })); // Set the generated slug value
    }
  }, [form.watch('name'), form]);
  const brands: IBrand[] = bData;
  //handle dropdon input changes
  const handleDropdownChange = (e: any) => {
    const { name, value } = e;

    dispatch(
      updateProductsData({ [name]: value }) // .then(handleReduxResponse());
    );
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomTextField
                  name="name"
                  control={form.control}
                  label="Name*"
                  placeholder="Enter name"
                  value={(pData as IProducts)?.name}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="slug"
                  control={form.control}
                  label="Slug*"
                  placeholder="Enter your Slug"
                  value={form.getValues('slug')}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="manufacture"
                  control={form.control}
                  label="Manufacture*"
                  placeholder="Enter manufacture"
                  value={form.getValues('manufacture')}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="model_no"
                  control={form.control}
                  label="Model No.*"
                  placeholder="Enter model number"
                  value={(pData as IProducts)?.model_no}
                  onChange={handleInputChange}
                  type="text"
                />
                <CustomTextField
                  name="meta_tag"
                  control={form.control}
                  label="Meta Tag*"
                  placeholder="Enter your meta tag"
                  value={(pData as IProducts)?.meta_tag}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  name="meta_description"
                  control={form.control}
                  label="Meta Description*"
                  placeholder="Enter your meta description"
                  value={(pData as IProducts)?.meta_description}
                  onChange={handleInputChange}
                />
                <CustomTextField
                  label="Meta Title*"
                  name="meta_title"
                  control={form.control}
                  placeholder="Enter meta title"
                  onChange={handleInputChange}
                  value={(pData as IProducts)?.meta_title}
                />
                <CustomTextField
                  name="sequence"
                  control={form.control}
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
                  label="Categories Testing*"
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
                  control={form.control}
                  placeholder="Enter HSN Code"
                  onChange={handleInputChange}
                  value={(pData as IProducts)?.hsn_code}
                />
                <CustomTextField
                  label="SKU*"
                  name="sku"
                  control={form.control}
                  placeholder="Enter SKU "
                  onChange={handleInputChange}
                  value={(pData as IProducts)?.sku}
                />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <CustomDropdown
                    control={form.control}
                    label="Is returnable "
                    name="return_able"
                    placeholder="Select is returnable"
                    defaultValue="false"
                    data={[
                      { name: 'True', _id: 'true' },
                      { name: 'false ', _id: 'false' }
                    ]}
                    loading={brandListLoading ?? false}
                    // value={form.getValues('parent') || ''}
                    value={(pData as IProducts)?.return_able}
                    onChange={handleDropdownChange}
                  />
                  {form.getValues('return_able') === 'true' && (
                    <CustomTextField
                      label="Number of days"
                      name="number_of_days"
                      control={form.control}
                      placeholder="Enter Number of days"
                      onChange={handleInputChange}
                      value={(pData as IProducts)?.number_of_days}
                      type="number"
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <CustomDropdown
                    control={form.control}
                    label="If cancel "
                    name="if_cancel"
                    placeholder="Select if cancel"
                    defaultValue="false"
                    data={[
                      { name: 'True', _id: 'true' },
                      { name: 'false ', _id: 'false' }
                    ]}
                    loading={brandListLoading ?? false}
                    // value={form.getValues('parent') || ''}
                    value={(pData as IProducts)?.if_cancel}
                    onChange={handleDropdownChange}
                  />
                  {form.getValues('if_cancel') === 'true' && (
                    <CustomTextField
                      label="Number of days"
                      name="cancel_days"
                      control={form.control}
                      placeholder="Enter number of days"
                      onChange={handleInputChange}
                      value={(pData as IProducts)?.cancel_days}
                      type="number"
                    />
                  )}
                </div>
                <div className="mb-4 flex items-center">
                  <input
                    id="cod-checkbox"
                    type="checkbox"
                    {...form.register('is_cod_allowed')} // Bind to react-hook-form
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  />
                  <label
                    htmlFor="cod-checkbox"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Is COD allowed?
                  </label>
                </div>
              </div>
              {/* Main Image Uploader */}
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
              {/* Multiple Image Upload */}

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

              {/* uploade video */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomDropdown
                  control={form.control}
                  label="Video Type "
                  name="videotype"
                  placeholder="Select Video Type"
                  defaultValue="none"
                  data={[
                    { name: 'None', _id: 'none' },
                    { name: 'Self Hosted', _id: 'selfmadevideo' },
                    { name: 'Vimeo ', _id: 'vimeovideo' },
                    { name: 'YouTube', _id: 'youtubvideo' }
                  ]}
                  loading={brandListLoading ?? false}
                  // value={form.getValues('parent') || ''}
                  value={(pData as IProducts)?.videotype}
                  onChange={handleDropdownChange}
                />
                {/* Conditional UI based on the selected video type */}
                {form.getValues('videotype') === 'selfmadevideo' && (
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
                        {/* <button
                          type="button"
                          onClick={handleRemoveVideoFile}
                          className="mt-1 text-red-500 underline"
                        >
                          Remove Video File
                        </button> */}
                      </div>
                    )}
                  </div>
                )}

                {form.getValues('videotype') === 'vimeovideo' && (
                  <CustomTextField
                    label=" Upload Video*"
                    name="videodata"
                    control={form.control}
                    placeholder="Enter Vimeo video URL"
                    onChange={handleInputChange}
                    value={(pData as IProducts)?.videodata}
                    type="url"
                  />
                )}

                {form.getValues('videotype') === 'youtubvideo' && (
                  <CustomTextField
                    label="Upload Video*"
                    name="videodata"
                    control={form.control}
                    placeholder="Enter YouTube video URL"
                    onChange={handleInputChange}
                    value={(pData as IProducts)?.videodata}
                    type="url"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomDropdown
                  control={form.control}
                  label="Maximum Order "
                  name="maxorder"
                  placeholder="Select Maximum Order"
                  defaultValue="false"
                  data={[
                    { name: 'True', _id: 'true' },
                    { name: 'false ', _id: 'false' }
                  ]}
                  loading={brandListLoading ?? false}
                  // value={form.getValues('parent') || ''}
                  value={(pData as IProducts)?.maxorder}
                  onChange={handleDropdownChange}
                />
                {form.getValues('maxorder') === 'true' && (
                  <CustomTextField
                    label="Maximum Order Value"
                    name="maxorder_value"
                    control={form.control}
                    placeholder="Enter maximum order value"
                    onChange={handleInputChange}
                    value={(pData as IProducts)?.maxorder_value}
                    type="number"
                  />
                )}
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CustomDropdown
                  control={form.control}
                  label="Minimum Order "
                  name="minorder"
                  placeholder="Select Minimum Order"
                  defaultValue="false"
                  data={[
                    { name: 'True', _id: 'true' },
                    { name: 'false ', _id: 'false' }
                  ]}
                  loading={brandListLoading ?? false}
                  // value={form.getValues('parent') || ''}
                  value={(pData as IProducts)?.minorder}
                  onChange={handleDropdownChange}
                />
                {form.getValues('minorder') === 'true' && (
                  <CustomTextField
                    label="Minimum Order Value"
                    name="minorder_value"
                    control={form.control}
                    placeholder="Enter minimum order value"
                    onChange={handleInputChange}
                    value={(pData as IProducts)?.minorder_value}
                    type="number"
                  />
                )}
              </div>
              <div className="">
                <h4 className="py-2">Additional Info</h4>

                {/* Tab Buttons */}
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
                  {form.getValues('productype') === 'variableproduct' &&
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
                      control={form.control}
                      label="Type of Product*"
                      name="productype"
                      placeholder="Select product type"
                      defaultValue="default"
                      data={[
                        { name: 'Simple Product', _id: 'simpleproduct' },
                        { name: 'Variable Product', _id: 'variableproduct' }
                      ]}
                      loading={brandListLoading ?? false}
                      value={
                        (pData as IProducts)?.productype ||
                        form.getValues('productype')
                      }
                      onChange={handleDropdownChange}
                      disabled={settingsSaved} // Disable dropdown if settings are saved
                    />

                    {/* Render SimpleProductForm if productype is 'simpleproduct' */}
                    {form.getValues('productype') === 'simpleproduct' && (
                      <SimpleProductForm
                        handleInputChange={handleInputChange}
                        disabled={settingsSaved}
                        entityId={entityId}
                        pData={pData}
                      />
                    )}

                    {/* Render StockmanagmentProductForm for both product type */}
                    {(form.getValues('productype') === 'simpleproduct' ||
                      form.getValues('productype') === 'variableproduct') && (
                      <StockmanagmentProductForm
                        handleInputChange={handleInputChange}
                        handleDropdownChange={handleDropdownChange}
                        producttype={form.getValues('productype')}
                        disabled={settingsSaved}
                      />
                    )}
                    {(form.getValues('productype') === 'simpleproduct' ||
                      form.getValues('productype') === 'variableproduct') && (
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

                {/* Quill Editor for Long Description */}
                <FormItem className="space-y-3">
                  <FormLabel>Description*</FormLabel>
                  <FormControl>
                    <ReactQuill
                      value={form.getValues('description')}
                      onChange={(value) => form.setValue('description', value)}
                      placeholder="Enter product description"
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
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

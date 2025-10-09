// 'use client';
// import PageContainer from '@/components/layout/page-container';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card';
// import { Form } from '@/components/ui/form';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { useAppDispatch, useAppSelector } from '@/redux/hooks';
// import {
//   addEditProducts,
//   fetchSingleProducts,
//   IProducts,
//   updateProductsData
// } from '@/redux/slices/store/productSlice';
// import CustomReactSelect from '@/utils/CustomReactSelect';
// import { fetchBrandList, IBrand } from '@/redux/slices/brandSlice';
// import CustomTextEditor from '@/utils/CustomTextEditor';
// import CustomTextField from '@/utils/CustomTextField';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';
// import { useEffect, useState } from 'react';
// import { fetchCountriesList } from '@/redux/slices/countriesSlice';
// import { fetchTagList } from '@/redux/slices/store/tagsSlice';
// import { fetchTaxList } from '@/redux/slices/taxsSlice';
// import { fetchCategoryList } from '@/redux/slices/store/categoriesSlice';
// import CustomDropdown from '@/utils/CusomDropdown';
// import { Switch } from '@/components/ui/switch';
// import SimpleProductForm from './othercomponents/simpleproductsdrop';
// import StockmanagmentProductForm from './othercomponents/stockmanagement';
// import AttributesForm from './othercomponents/attributes';
// import VariationsForm from './othercomponents/variations';
// import { fetchApi } from '@/services/utlis/fetchApi';
// import slugify from 'slugify';

// interface TabsState {
//   general: boolean;
//   attribute: boolean;
//   variations: boolean;
// }

// export default function ProductsFormMine() {
//   const router = useRouter();
//   const params = useSearchParams();
//   const entityId = params?.get('id');
//   const dispatch = useAppDispatch();

//   const [mainImage, setMainImage] = useState<File | null>(null);
//   const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
//   const [secondMainImage, setSecondMainImage] = useState<File | null>(null);
//   const [secondMainImagePreview, setSecondMainImagePreview] = useState<
//     string | null
//   >(null);
//   const [otherImages, setOtherImages] = useState<File[]>([]);
//   const [variations, setVariations] = useState<any[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [videoFile, setVideoFile] = useState<File | null>(null);
//   const [videoFileName, setVideoFileName] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState('general');
//   const [attributes, setAttributes] = useState<
//     { type: string; values: string[] }[]
//   >([]);
//   const [settingsSaved, setSettingsSaved] = useState(false);
//   const [tabsEnabled, setTabsEnabled] = useState<TabsState>({
//     general: true,
//     attribute: false,
//     variations: false
//   });

//   const {
//     singleProductsState: { loading, data: pData }
//   } = useAppSelector((state) => state.productsdata);
//   const {
//     categoryListState: { loading: categoryListLoading, data: cData = [] }
//   } = useAppSelector((state) => state.category);
//   const {
//     tagListState: { loading: tagListLoading, data: tagData = [] }
//   } = useAppSelector((state) => state.tags);
//   const {
//     taxListState: { loading: taxListLoading, data: taxData = [] }
//   } = useAppSelector((state) => state.taxsdata);
//   const {
//     brandListState: { loading: brandListLoading, data: bData = [] }
//   } = useAppSelector((state) => state.brand);
//   const {
//     countriesListState: { loading: countryListLoading, data: canData = []}
//   } = useAppSelector((state) => state.countries);

//   const form = useForm({defaultValues: {}});

//   useEffect(() => {
//     if (entityId) {
//       dispatch(fetchSingleProducts(entityId));
//     }
//   }, [entityId]);

//   const brands: IBrand[] = bData;
//   const page = 1;
//   const pageSize = 100000;
//   useEffect(() => {
//     dispatch(fetchCountriesList({ page, pageSize }));
//     dispatch(
//       fetchTagList({
//         page,
//         pageSize,
//         keyword: '',
//         field: '',
//         active: 'true',
//         exportData: 'true'
//       })
//     );
//     dispatch(
//       fetchTaxList({
//         page,
//         pageSize,
//         keyword: '',
//         field: '',
//         active: 'true'
//       })
//     );
//     dispatch(
//       fetchBrandList({
//         page,
//         pageSize,
//         keyword: '',
//         field: '',
//         status: 'true',
//         exportData: 'true'
//       })
//     );

//     dispatch(
//       fetchCategoryList({
//         page,
//         pageSize,
//         keyword: '',
//         field: '',
//         entityId: ''
//       })
//     );
//   }, [dispatch]);

//   const handleDropdownChange = (e: any) => {
//     const { name, value } = e;
//     dispatch(
//       updateProductsData({ [name]: value }) // .then(handleReduxResponse());
//     );
//   };

//   const handleInputChange = (e: any) => {
//     const { name, value, type, files, checked } = e.target;
//     dispatch(
//       updateProductsData({
//         [name]:
//           type === 'file'
//             ? files[0]
//             : type === 'checkbox'
//             ? checked
//             : type === 'number'
//             ? Number(value)
//             : value
//       })
//     );
//   };

//   // Fixed handleSaveSettings function
//   const handleSaveSettings = () => {
//     if (!pData) {
//       toast.error('Product data is not available');
//       return;
//     }

//     const formData:any = { ...pData };
//     let requiredFields: any[] = [];

//     const missingFields = requiredFields.filter(
//       (field) => !formData[field]
//     );

//     if (missingFields.length > 0) {
//       toast.error(`Missing  fields required: ${missingFields.join(', ')}`);
//       return;
//     }

//     // Enable the "Attribute" and "Variations" tabs after saving settings
//     setTabsEnabled((prev) => ({
//       ...prev,
//       attribute: true,
//       variations: true // Only enable variations for variable products
//     }));

//     // Mark settings as saved
//     setSettingsSaved(true);

//     toast.success('Settings saved successfully!');
//   };

//   // Fixed handleSubmit function
//   const handleSubmit = async () => {
//     if (entityId) {
//       handleSaveSettings();
//     }
//     if (!pData) {
//       toast.error('Product data is not available');
//       return;
//     }

//     // Validate required fields
//     let missingFields: any[] = [];
//     const categories = pData.categories?.length > 0 ? pData.categories : [];
//     const brandName = pData.brand_name || '';
//     const madeIn = pData.madeIn || '';
//     const tags = pData.tags || '';
//     const tax = pData.tax || '';

//     // If any fields are missing, show an error message with the field names
//     if (missingFields.length > 0) {
//       toast.error(
//         `The following fields are required: ${missingFields.join(', ')}`
//       );
//       return;
//     }

//     // If product type is variable, ensure at least one attribute is selected
//     if (
//       pData.productype === 'variableproduct' &&
//       (!attributes || attributes.length === 0)
//     ) {
//       toast.error('At least one attribute is required for variable products');
//       return;
//     }

//     // Validate video data if videotype is selected
//     if (pData.videotype && pData.videotype !== 'none') {
//       if (
//         pData.videotype === 'selfmadevideo' &&
//         !videoFile &&
//         !pData.videodata
//       ) {
//         toast.error('Video file is required for self-hosted videos');
//         return;
//       } else if (pData.videotype !== 'selfmadevideo' && !pData.videodata) {
//         toast.error('Video URL is required when video type is selected');
//         return;
//       }
//     }

//     // Validate variations if product is variable and variations exist
//     if (variations?.length > 0) {
//       let isValid = true;

//       let variationErrors: any[] = [];

//       variations.forEach((variation, index) => {
//         let missingVariationFields: any[] = [];

//         if (!variation.price) missingVariationFields.push('Price');
//         if (!variation.special_price)
//           missingVariationFields.push('Special Price');
//         if (!variation.weight) missingVariationFields.push('Weight');
//         if (!variation.height) missingVariationFields.push('Height');
//         if (!variation.breadth) missingVariationFields.push('Breadth');
//         if (!variation.length) missingVariationFields.push('Length');
//         if (pData.productype != 'simpleproduct') {
//           if (!variation.sku) missingVariationFields.push('SKU');
//           if (!variation.image) missingVariationFields.push('Image');
//         }

//         if (missingVariationFields.length > 0) {
//           isValid = false;
//           variationErrors.push(
//             `Variation ${index + 1}: ${missingVariationFields.join(', ')}`
//           );
//         }
//       });

//       if (!isValid) {
//         toast.error(
//           `Please fill in the required fields for variations:\n${variationErrors.join(
//             '\n'
//           )}`
//         );
//         return;
//       }
//     }

//     // Determine video data based on video type
//     const finalVideoData =
//       pData.videotype === 'selfmadevideo' ? videoFile : pData.videodata;

//     // Handle variations based on product type
//     let finalVariations = variations;

//     // Upload images for variations if needed
//     const uploadImageAndUpdate = async () => {
//       // Create a copy of the variations array
//       const updatedVariations = [...finalVariations];

//       for (let i = 0; i < updatedVariations.length; i++) {
//         const item = updatedVariations[i];

//         const formData = new FormData();

//         if (item.image) {
//           const fileType = item?.image?.type?.startsWith('image/')
//             ? 'imagefile'
//             : item?.image?.type?.startsWith('audio/')
//             ? 'audiofile'
//             : 'file';

//           formData.append(fileType, item?.image);

//           try {
//             const response = await fetchApi('/files', {
//               method: 'POST',
//               body: formData
//             });

//             // Update the finalVariations array with the response data
//             finalVariations[i] = {
//               ...item,
//               image: response?.result?.imageFileUrl
//             };
//           } catch (error) {
//             console.error('Error uploading file:', error);
//           }
//         }
//       }

//       // Update finalVariations with the processed data
//       // finalVariations = updatedVariations;
//     };

//     // Process variations images

//     await uploadImageAndUpdate();

//     // Format attributes properly for saving
//     const attributesToSave = attributes.map((attr) => ({
//       type: attr?.type?._id,
//       values: attr?.values.map((value: any) => value?._id)
//     }));

//     // Create the final data for submission
//     const finalData = {
//       ...(pData || {}),
//       brand_name: brandName,
//       madeIn: madeIn,
//       tags: tags,
//       tax: tax,
//       categories: categories,
//       variations: finalVariations,
//       attributes: attributesToSave,
//       // Handle main images appropriately
//       main_image: mainImage || pData.main_image || '',
//       second_main_image: secondMainImage || pData.second_main_image || '',
//       videodata: finalVideoData || '',
//       other_image: otherImages || []
//     };

//     // Update the product data in Redux
//     dispatch(updateProductsData(finalData));

//     // Submit the data to the API
//     dispatch(addEditProducts(entityId || null)).then((response) => {
//       if (!response?.payload?.error) {
//         router.push('/dashboard/store/products');
//         toast.success(
//           response?.payload?.message || 'Product saved successfully'
//         );
//       } else {
//         toast.error(response?.payload || 'Failed to save product');
//       }
//     });
//   };

//   useEffect(() => {
//     if (!entityId) {
//       const name = (pData as IProducts)?.name;
//       if (name) {
//         const generatedSlug = slugify(name, {
//           lower: true,
//           strict: true,
//           trim: true
//         });
//         dispatch(updateProductsData({ ['slug']: generatedSlug }));
//       }
//     }
//   }, [(pData as IProducts)?.name, entityId]);

//   console.log("(pData as IProducts)?.if_cancel", typeof (pData as IProducts)?.if_cancel)

//   return (
//     <PageContainer scrollable>
//       <Card className="mx-auto mb-16 w-full">
//         <CardHeader>
//           <CardTitle className="text-left text-2xl font-bold">
//             Products Information
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleSubmit)}
//               className="space-y-8"
//             >
//               <CustomTextField
//                 name="name"
//                 label="Name*"
//                 placeholder="Enter name"
//                 value={(pData as IProducts)?.name}
//                 onChange={handleInputChange}
//                 type="text"
//               />
//               <CustomTextField
//                 name="slug"
//                 label="Slug*"
//                 placeholder="Enter slug"
//                 value={(pData as IProducts)?.slug}
//                 onChange={handleInputChange}
//                 type="text"
//               />
//               <CustomTextField
//                 name="sequence"
//                 label="Sequence*"
//                 placeholder="Enter your sequence"
//                 value={(pData as IProducts)?.sequence}
//                 onChange={handleInputChange}
//                 type="number"
//               />
//               <Tabs defaultValue="English" className="mt-4 w-full">
//                 <TabsList className="flex w-full space-x-2 p-0">
//                   <TabsTrigger
//                     value="English"
//                     className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
//                   >
//                     English
//                   </TabsTrigger>
//                   <TabsTrigger
//                     value="Hindi"
//                     className="flex-1 rounded-md py-2 text-center hover:bg-gray-200"
//                   >
//                     Hindi
//                   </TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="English">
//                   <CardContent className="space-y-2 p-0">
//                     <CustomTextField
//                       name="title.en"
//                       label="Title (English)*"
//                       placeholder="Enter title"
//                       value={(pData as IProducts)?.title?.en}
//                       onChange={handleInputChange}
//                     />

//                     <CustomTextField
//                       name="manufacture.en"
//                       label="Manufacture (English)*"
//                       placeholder="Enter manufacture"
//                       value={(pData as IProducts)?.manufacture?.en}
//                       onChange={handleInputChange}
//                     />

//                     <CustomTextEditor
//                       name="description.en"
//                       label="Full Description (English)"
//                       value={(pData as IProducts)?.description?.en}
//                       onChange={(value) =>
//                         handleInputChange({
//                           target: {
//                             name: 'description.en',
//                             value: value,
//                             type: 'text'
//                           }
//                         })
//                       }
//                     />
//                   </CardContent>
//                 </TabsContent>

//                 <TabsContent value="Hindi">
//                   <CardContent className="space-y-2 p-0">
//                     <CustomTextField
//                       name="title.hi"
//                       label="Tilte (Hindi)*"
//                       placeholder="Enter Title"
//                       value={(pData as IProducts)?.title?.hi}
//                       onChange={handleInputChange}
//                     />

//                     <CustomTextField
//                       name="manufacture.hi"
//                       label="Manufacture (Hindi)*"
//                       placeholder="Enter manufacture"
//                       value={(pData as IProducts)?.manufacture?.hi}
//                       onChange={handleInputChange}
//                     />

//                     <CustomTextEditor
//                       name="description.hi"
//                       label="Full Description (Hindi)"
//                       value={(pData as IProducts)?.description?.hi}
//                       onChange={(value) =>
//                         handleInputChange({
//                           target: {
//                             name: 'description.hi',
//                             value: value,
//                             type: 'text'
//                           }
//                         })
//                       }
//                     />
//                   </CardContent>
//                 </TabsContent>
//               </Tabs>
//               <CustomTextField
//                 name="model_no"
//                 label="Model No.*"
//                 placeholder="Enter model number"
//                 value={(pData as IProducts)?.model_no}
//                 onChange={handleInputChange}
//                 type="text"
//               />
//               <CustomTextField
//                 label="Meta Title*"
//                 name="meta_title"
//                 placeholder="Enter meta title"
//                 onChange={handleInputChange}
//                 value={(pData as IProducts)?.meta_title}
//               />
//               <CustomTextField
//                 name="meta_description"
//                 label="Meta Description*"
//                 placeholder="Enter your meta description"
//                 value={(pData as IProducts)?.meta_description}
//                 onChange={handleInputChange}
//               />
//               <CustomTextField
//                 name="meta_tag"
//                 label="Meta Tag*"
//                 placeholder="Enter your meta tag"
//                 value={(pData as IProducts)?.meta_tag}
//                 onChange={handleInputChange}
//               />
//               <CustomReactSelect
//                 options={brands}
//                 label="Brand Name*"
//                 getOptionLabel={(option) => option.name.en || ''}
//                 getOptionValue={(option) => option._id}
//                 placeholder="Select Brand"
//                 onChange={(e: any) =>
//                   handleInputChange({
//                     target: { name: 'brand_name', value: e }
//                   })
//                 }
//                 value={(pData as IProducts)?.brand_name}
//               />
//               <CustomReactSelect
//                 options={canData}
//                 label="Made In*"
//                 getOptionLabel={(option) => option.name}
//                 getOptionValue={(option) => option._id}
//                 placeholder="Select Country"
//                 onChange={(e: any) =>
//                   handleInputChange({
//                     target: { name: 'madeIn', value: e }
//                   })
//                 }
//                 value={(pData as IProducts)?.madeIn}
//               />
//               <CustomReactSelect
//                 options={cData}
//                 isMulti
//                 label="Categories*"
//                 getOptionLabel={(option) => option.title.en}
//                 getOptionValue={(option) => option._id}
//                 placeholder="Select Categories"
//                 onChange={(e: any) =>
//                   handleInputChange({
//                     target: { name: 'categories', value: e }
//                   })
//                 }
//                 value={(pData as IProducts)?.categories}
//               />
//               <CustomReactSelect
//                 options={tagData}
//                 label="Tags*"
//                 getOptionLabel={(option) => option.name.en}
//                 getOptionValue={(option) => option._id}
//                 placeholder="Select Tags"
//                 onChange={(e: any) =>
//                   handleInputChange({
//                     target: { name: 'tags', value: e }
//                   })
//                 }
//                 value={(pData as IProducts)?.tags}
//               />
//               <CustomReactSelect
//                 options={taxData}
//                 label="Tax*"
//                 getOptionLabel={(option) => option.name.en}
//                 getOptionValue={(option) => option._id}
//                 placeholder="Select Tax"
//                 onChange={(e: any) =>
//                   handleInputChange({
//                     target: { name: 'tax', value: e }
//                   })
//                 }
//                 value={(pData as IProducts)?.tax}
//               />
//               <CustomTextField
//                 label="HSN code*"
//                 name="hsn_code"
//                 placeholder="Enter HSN Code"
//                 onChange={handleInputChange}
//                 value={(pData as IProducts)?.hsn_code}
//               />
//               <CustomTextField
//                 label="SKU*"
//                 name="sku"
//                 placeholder="Enter SKU "
//                 onChange={handleInputChange}
//                 value={(pData as IProducts)?.sku}
//               />
//               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                 <CustomDropdown
//                   // control={form.control}
//                   label="Is Return"
//                   name="return_able"
//                   required={true}
//                   value={(pData as IProducts)?.return_able}
//                   defaultValue={(pData as IProducts)?.return_able || 'false'}
//                   data={[
//                     { name: 'True', _id: 'true' },
//                     { name: 'False', _id: 'false' }
//                   ]}
//                   onChange={handleDropdownChange}
//                 />
//                 {(pData as IProducts)?.return_able === "true" && (
//                   <CustomTextField
//                     label="Number of days"
//                     name="number_of_days"
//                     placeholder="Enter Number of days"
//                     onChange={handleInputChange}
//                     value={(pData as IProducts)?.number_of_days}
//                     type="number"
//                   />
//                 )}
//               </div>
//               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//                 <CustomDropdown
//                   // control={form.control}
//                   label="Is Cancle"
//                   name="if_cancel"
//                   required={true}
//                   value={(pData as IProducts)?.if_cancel}
//                   defaultValue={(pData as IProducts)?.if_cancel || 'false'}
//                   data={[
//                     { name: 'True', _id: 'true' },
//                     { name: 'False', _id: 'false' }
//                   ]}
//                   onChange={handleDropdownChange}
//                 />
//                 {(pData as IProducts)?.if_cancel === "true" && (
//                   <CustomTextField
//                     label="Number Of Days"
//                     name="cancel_days"
//                     placeholder="Enter Number of days"
//                     onChange={handleInputChange}
//                     value={(pData as IProducts)?.cancel_days}
//                     type="number"
//                   />
//                 )}
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className='text-md'>Is COD Available</div>
//                 <Switch
//                   className="!m-0"
//                   name='Is COD Available?'
//                   checked={(pData as IProducts)?.is_cod_allowed}
//                   // onCheckedChange={handleToggle}
//                   onCheckedChange={(checked: any) =>
//                     handleInputChange({
//                       target: {
//                         type: 'checkbox',
//                         name: 'is_cod_allowed',
//                         checked
//                       }
//                     })
//                   }
//                   aria-label="Toggle Active Status"
//                 />
//               </div>
//             </form>
//           </Form>
//         </CardContent>
//         <CardFooter
//           style={{
//             display: 'flex',
//             justifyContent: 'center',
//             marginBottom: '1rem'
//           }}
//         >
//           <Button type="submit" onClick={() => handleSubmit()}>
//             Submit
//           </Button>
//         </CardFooter>
//       </Card>
//     </PageContainer>
//   );
// }

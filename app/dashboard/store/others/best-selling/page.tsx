// 'use client';
// import { FileUploader, FileViewCard } from '@/components/file-uploader';
// import PageContainer from '@/components/layout/page-container';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card';
// import { Form, FormItem, FormLabel } from '@/components/ui/form';
// import CustomTextField from '@/utils/CustomTextField';
// import React, { useEffect, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';
// import { useAppDispatch, useAppSelector } from '@/redux/hooks';
// import {
//   addEditSales,
//   fetchSales,
//   ISales,
//   setSales,
//   updateSalesPage
// } from '@/redux/slices/salesSlice';
// import { Input } from '@/components/ui/input';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // import CustomTextEditor from '@/utils/CustomTextEditor';
// import { Label } from '@/components/ui/label';

// const Page = () => {
//   const dispatch = useAppDispatch();
//   const {
//     salesState: { loading, data: cData = [] }
//   } = useAppSelector((state) => state.sales);

//   const [leftImage, setLeftImage] = useState<File | null>(null);
//   const [rightImage, setRightImage] = useState<File | null>(null);
//   const [upperImage, setUpperImage] = useState<File | null>(null);
//   const [lowerImage, setLowerImage] = useState<File | null>(null);
//   const [mainImage, setMainImage] = useState<File | null>(null);

//   useEffect(() => {
//     dispatch(fetchSales(null));
//   }, []);

//   const form = useForm({
//     defaultValues: {}
//   });

//   const handleInputChange = (e: any) => {
//     const { name, value, type, files, checked } = e.target;
//     dispatch(
//       updateSalesPage({
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

//   const handleSubmit = () => {
//     if (!cData) {
//       toast.error('Please fill in the required fields.');
//       return;
//     }

//     dispatch(addEditSales(null)).then((response: any) => {
//       if (!response?.error) {
//         toast.success(response?.payload?.message);
//       } else {
//         toast.error(response.payload);
//       }
//     });
//   };

//   return (
//     <PageContainer scrollable>
//       <Card className="mx-auto mb-16 w-full">
//         <CardHeader>
//           <CardTitle className="text-left text-2xl font-bold">
//             Sales Info
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleSubmit)}
//               className="space-y-8"
//             >
//               <div className="flex items-center space-x-2">
//                 <Card className=" w-full">
//                   <CardHeader className="flex flex-row items-center justify-center">
//                     <CardTitle>MAIN TITLE / IMAGES</CardTitle>
//                   </CardHeader>

//                   <div className="space-y-2 p-6 pt-0 ">
//                     {/* Dark Logo */}
//                     <FormItem className="space-y-3">
//                       <FormLabel>Main Image</FormLabel>
//                       <FileUploader
//                         value={mainImage ? [mainImage] : []}
//                         onValueChange={(newFiles: any) => {
//                           setMainImage(newFiles[0] || null);
//                           handleInputChange({
//                             target: {
//                               name: 'images.mainImage',
//                               type: 'file',
//                               files: newFiles
//                             }
//                           });
//                         }}
//                         accept={{ 'image/*': [] }}
//                         maxSize={1024 * 1024 * 2}
//                       />{' '}
//                       <>
//                         {typeof (cData as ISales)?.images?.mainImage ===
//                           'string' && (
//                           <>
//                             <div className="max-h-48 space-y-4">
//                               <FileViewCard
//                                 existingImageURL={
//                                   (cData as ISales)?.images?.mainImage
//                                 }
//                               />
//                             </div>
//                           </>
//                         )}
//                       </>
//                     </FormItem>

//                     <Label htmlFor="name">Main English Title</Label>
//                     <Input
//                       name="titles.mainTitle.en"
//                       placeholder="Enter Main English Title "
//                       value={(cData as ISales)?.titles?.mainTitle?.en}
//                       onChange={handleInputChange}
//                     />

//                     <Label htmlFor="name">Main Hindi Title</Label>
//                     <Input
//                       name="titles.mainTitle.hi"
//                       placeholder="Enter Main Hindi Title "
//                       value={(cData as ISales)?.titles?.mainTitle?.hi}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   <CardHeader className="flex flex-row items-center justify-between">
//                     <CardTitle>LEFT SIDE TITLE / IMAGES</CardTitle>
//                   </CardHeader>

//                   <div className="space-y-2 p-6 pt-0 ">
//                     {/* Dark Logo */}
//                     <FormItem className="space-y-3">
//                       <FormLabel>Left Image</FormLabel>
//                       <FileUploader
//                         value={leftImage ? [leftImage] : []}
//                         onValueChange={(newFiles: any) => {
//                           setLeftImage(newFiles[0] || null);
//                           handleInputChange({
//                             target: {
//                               name: 'images.leftImage',
//                               type: 'file',
//                               files: newFiles
//                             }
//                           });
//                         }}
//                         accept={{ 'image/*': [] }}
//                         maxSize={1024 * 1024 * 2}
//                       />{' '}
//                       <>
//                         {typeof (cData as ISales)?.images?.leftImage ===
//                           'string' && (
//                           <>
//                             <div className="max-h-48 space-y-4">
//                               <FileViewCard
//                                 existingImageURL={
//                                   (cData as ISales)?.images?.leftImage
//                                 }
//                               />
//                             </div>
//                           </>
//                         )}
//                       </>
//                     </FormItem>

//                     <Label htmlFor="name">Left English Title</Label>
//                     <Input
//                       name="titles.leftTitle.en"
//                       placeholder="Enter Left English Title "
//                       value={(cData as ISales)?.titles?.leftTitle?.en}
//                       onChange={handleInputChange}
//                     />

//                     <Label htmlFor="name">Left Hindi Title</Label>
//                     <Input
//                       name="titles.leftTitle.hi"
//                       placeholder="Enter Left Hindi Title "
//                       value={(cData as ISales)?.titles?.leftTitle?.hi}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   <CardHeader className="flex flex-row items-center justify-between">
//                     <CardTitle>RIGHT SIDE TITLE / IMAGES</CardTitle>
//                   </CardHeader>

//                   <CardContent className="space-y-2">
//                     <FormItem className="space-y-3">
//                       <FormLabel>Right Image</FormLabel>
//                       <FileUploader
//                         value={rightImage ? [rightImage] : []}
//                         onValueChange={(newFiles: any) => {
//                           setRightImage(newFiles[0] || null);
//                           handleInputChange({
//                             target: {
//                               name: 'images.rightImage',
//                               type: 'file',
//                               files: newFiles
//                             }
//                           });
//                         }}
//                         accept={{ 'image/*': [] }}
//                         maxSize={1024 * 1024 * 2}
//                       />{' '}
//                       <>
//                         {typeof (cData as ISales)?.images?.rightImage ===
//                           'string' && (
//                           <>
//                             <div className="max-h-48 space-y-4">
//                               <FileViewCard
//                                 existingImageURL={
//                                   (cData as ISales)?.images?.rightImage
//                                 }
//                               />
//                             </div>
//                           </>
//                         )}
//                       </>
//                     </FormItem>

//                     <Label htmlFor="name">Right English Title</Label>
//                     <Input
//                       name="titles.rightTitle.en"
//                       placeholder="Enter Right English Title "
//                       value={(cData as ISales)?.titles?.rightTitle?.en}
//                       onChange={handleInputChange}
//                     />
//                     <Label htmlFor="name">Right Hindi Title</Label>
//                     <Input
//                       name="titles.rightTitle.hi"
//                       placeholder="Enter Right Hindi Title "
//                       value={(cData as ISales)?.titles?.rightTitle?.hi}
//                       onChange={handleInputChange}
//                     />
//                   </CardContent>

//                   <CardHeader className="flex flex-row items-center justify-between">
//                     <CardTitle>UPPER SIDE TITLE / IMAGES</CardTitle>
//                   </CardHeader>

//                   <CardContent className="space-y-2">
//                     <FormItem className="space-y-3">
//                       <FormLabel>Upper Image</FormLabel>
//                       <FileUploader
//                         value={upperImage ? [upperImage] : []}
//                         onValueChange={(newFiles: any) => {
//                           setUpperImage(newFiles[0] || null);
//                           handleInputChange({
//                             target: {
//                               name: 'images.upperImage',
//                               type: 'file',
//                               files: newFiles
//                             }
//                           });
//                         }}
//                         accept={{ 'image/*': [] }}
//                         maxSize={1024 * 1024 * 2}
//                       />{' '}
//                       <>
//                         {typeof (cData as ISales)?.images?.upperImage ===
//                           'string' && (
//                           <>
//                             <div className="max-h-48 space-y-4">
//                               <FileViewCard
//                                 existingImageURL={
//                                   (cData as ISales)?.images?.upperImage
//                                 }
//                               />
//                             </div>
//                           </>
//                         )}
//                       </>
//                     </FormItem>

//                     <Label htmlFor="name">Upper English Title</Label>
//                     <Input
//                       name="titles.upperTitle.en"
//                       placeholder="Enter Upper English Title "
//                       value={(cData as ISales)?.titles?.upperTitle?.en}
//                       onChange={handleInputChange}
//                     />
//                     <Label htmlFor="name">Right Hindi Title</Label>
//                     <Input
//                       name="titles.upperTitle.hi"
//                       placeholder="Enter Upper Hindi Title "
//                       value={(cData as ISales)?.titles?.upperTitle?.hi}
//                       onChange={handleInputChange}
//                     />
//                   </CardContent>

//                   <CardHeader className="flex flex-row items-center justify-between">
//                     <CardTitle>LOWER SIDE TITLE / IMAGES</CardTitle>
//                   </CardHeader>

//                   <CardContent className="space-y-2">
//                     <FormItem className="space-y-3">
//                       <FormLabel>Left Image</FormLabel>
//                       <FileUploader
//                         value={lowerImage ? [lowerImage] : []}
//                         onValueChange={(newFiles: any) => {
//                           setLowerImage(newFiles[0] || null);
//                           handleInputChange({
//                             target: {
//                               name: 'images.lowerImage',
//                               type: 'file',
//                               files: newFiles
//                             }
//                           });
//                         }}
//                         accept={{ 'image/*': [] }}
//                         maxSize={1024 * 1024 * 2}
//                       />{' '}
//                       <>
//                         {typeof (cData as ISales)?.images?.lowerImage ===
//                           'string' && (
//                           <>
//                             <div className="max-h-48 space-y-4">
//                               <FileViewCard
//                                 existingImageURL={
//                                   (cData as ISales)?.images?.lowerImage
//                                 }
//                               />
//                             </div>
//                           </>
//                         )}
//                       </>
//                     </FormItem>

//                     <Label htmlFor="name">Lower English Title</Label>
//                     <Input
//                       name="titles.lowerTitle.en"
//                       placeholder="Enter Lower English Title "
//                       value={(cData as ISales)?.titles?.lowerTitle?.en}
//                       onChange={handleInputChange}
//                     />
//                     <Label htmlFor="name">Lower Hindi Title</Label>
//                     <Input
//                       name="titles.lowerTitle.hi"
//                       placeholder="Enter Lower Hindi Title "
//                       value={(cData as ISales)?.titles?.lowerTitle?.hi}
//                       onChange={handleInputChange}
//                     />
//                   </CardContent>
//                 </Card>
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
// };

// export default Page;

'use client';
import { FileUploader, FileViewCard } from '@/components/file-uploader';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Form, FormItem, FormLabel } from '@/components/ui/form';
import CustomTextField from '@/utils/CustomTextField';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addEditSales,
  fetchSales,
  ISales,
  setSales,
  updateSalesPage
} from '@/redux/slices/salesSlice';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

const Page = () => {
  const dispatch = useAppDispatch();
  const {
    salesState: { loading, data: cData }
  } = useAppSelector((state) => state.sales);

  // Local file states for UI management
  const [leftImage, setLeftImage] = useState<File | null>(null);
  const [rightImage, setRightImage] = useState<File | null>(null);
  const [upperImage, setUpperImage] = useState<File | null>(null);
  const [lowerImage, setLowerImage] = useState<File | null>(null);
  const [mainImage, setMainImage] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchSales(null));
  }, [dispatch]);

  // Initialize empty sales data if none exists
  useEffect(() => {
    if (cData === null) {
      dispatch(
        setSales({
          images: {},
          titles: {
            mainTitle: { en: '', hi: '' },
            leftTitle: { en: '', hi: '' },
            rightTitle: { en: '', hi: '' },
            upperTitle: { en: '', hi: '' },
            lowerTitle: { en: '', hi: '' }
          },
          links: {
            leftLink: '',
            rightLink: '',
            upperLink: '',
            lowerLink: ''
          }
        })
      );
    }
  }, [cData, dispatch]);

  const form = useForm({
    defaultValues: {}
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, files, checked } = e.target;
    dispatch(
      updateSalesPage({
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

  const handleSubmit = () => {
    if (!cData) {
      toast.error('Please fill in the required fields.');
      return;
    }

    dispatch(addEditSales(null)).then((response: any) => {
      if (!response?.error) {
        toast.success(
          response?.payload?.message || 'Sales data updated successfully!'
        );
      } else {
        toast.error(response.payload);
      }
    });
  };

  const handleFileUpload = (
    fieldName: string,
    files: File[],
    setLocalFile: (file: File | null) => void
  ) => {
    const file = files[0] || null;
    setLocalFile(file);
    handleInputChange({
      target: {
        name: fieldName,
        type: 'file',
        files: files
      }
    });
  };

  if (!cData) {
    return (
      <PageContainer scrollable>
        <div className="flex h-64 items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable>
      <Card className="mx-auto mb-16 w-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            Sales Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="flex items-center space-x-2">
                <Card className="w-full">
                  {/* MAIN SECTION */}
                  <CardHeader className="flex flex-row items-center justify-center">
                    <CardTitle>MAIN TITLE / IMAGES</CardTitle>
                  </CardHeader>

                  <div className="space-y-4 p-6 pt-0">
                    <FormItem className="space-y-3">
                      <FormLabel>Main Image</FormLabel>
                      <FileUploader
                        value={mainImage ? [mainImage] : []}
                        onValueChange={(newFiles: any) =>
                          handleFileUpload(
                            'images.mainImage',
                            newFiles,
                            setMainImage
                          )
                        }
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />
                      {typeof cData?.images?.mainImage === 'string' && (
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={cData.images.mainImage}
                          />
                        </div>
                      )}
                    </FormItem>

                    <div className="space-y-2">
                      <Label htmlFor="mainTitleEn">Main English Title</Label>
                      <Input
                        id="mainTitleEn"
                        name="titles.mainTitle.en"
                        placeholder="Enter Main English Title"
                        value={cData.titles?.mainTitle?.en || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mainTitleHi">Main Hindi Title</Label>
                      <Input
                        id="mainTitleHi"
                        name="titles.mainTitle.hi"
                        placeholder="Enter Main Hindi Title"
                        value={cData.titles?.mainTitle?.hi || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* LEFT SECTION */}
                  <CardHeader className="flex flex-row items-center justify-center">
                    <CardTitle>LEFT SIDE TITLE / IMAGES / LINKS</CardTitle>
                  </CardHeader>

                  <div className="space-y-4 p-6 pt-0">
                    <FormItem className="space-y-3">
                      <FormLabel>Left Image</FormLabel>
                      <FileUploader
                        value={leftImage ? [leftImage] : []}
                        onValueChange={(newFiles: any) =>
                          handleFileUpload(
                            'images.leftImage',
                            newFiles,
                            setLeftImage
                          )
                        }
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />
                      {typeof cData?.images?.leftImage === 'string' && (
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={cData.images.leftImage}
                          />
                        </div>
                      )}
                    </FormItem>

                    <div className="space-y-2">
                      <Label htmlFor="leftTitleEn">Left English Title</Label>
                      <Input
                        id="leftTitleEn"
                        name="titles.leftTitle.en"
                        placeholder="Enter Left English Title"
                        value={cData.titles?.leftTitle?.en || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="leftTitleHi">Left Hindi Title</Label>
                      <Input
                        id="leftTitleHi"
                        name="titles.leftTitle.hi"
                        placeholder="Enter Left Hindi Title"
                        value={cData.titles?.leftTitle?.hi || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="leftLink">Left Link</Label>
                      <Input
                        id="leftLink"
                        name="links.leftLink"
                        placeholder="Enter Left Link URL"
                        value={cData.links?.leftLink || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* RIGHT SECTION */}
                  <CardHeader className="flex flex-row items-center justify-center">
                    <CardTitle>RIGHT SIDE TITLE / IMAGES / LINKS</CardTitle>
                  </CardHeader>

                  <div className="space-y-4 p-6 pt-0">
                    <FormItem className="space-y-3">
                      <FormLabel>Right Image</FormLabel>
                      <FileUploader
                        value={rightImage ? [rightImage] : []}
                        onValueChange={(newFiles: any) =>
                          handleFileUpload(
                            'images.rightImage',
                            newFiles,
                            setRightImage
                          )
                        }
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />
                      {typeof cData?.images?.rightImage === 'string' && (
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={cData.images.rightImage}
                          />
                        </div>
                      )}
                    </FormItem>

                    <div className="space-y-2">
                      <Label htmlFor="rightTitleEn">Right English Title</Label>
                      <Input
                        id="rightTitleEn"
                        name="titles.rightTitle.en"
                        placeholder="Enter Right English Title"
                        value={cData.titles?.rightTitle?.en || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rightTitleHi">Right Hindi Title</Label>
                      <Input
                        id="rightTitleHi"
                        name="titles.rightTitle.hi"
                        placeholder="Enter Right Hindi Title"
                        value={cData.titles?.rightTitle?.hi || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rightLink">Right Link</Label>
                      <Input
                        id="rightLink"
                        name="links.rightLink"
                        placeholder="Enter Right Link URL"
                        value={cData.links?.rightLink || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* UPPER SECTION */}
                  <CardHeader className="flex flex-row items-center justify-center">
                    <CardTitle>UPPER SIDE TITLE / IMAGES / LINKS</CardTitle>
                  </CardHeader>

                  <div className="space-y-4 p-6 pt-0">
                    <FormItem className="space-y-3">
                      <FormLabel>Upper Image</FormLabel>
                      <FileUploader
                        value={upperImage ? [upperImage] : []}
                        onValueChange={(newFiles: any) =>
                          handleFileUpload(
                            'images.upperImage',
                            newFiles,
                            setUpperImage
                          )
                        }
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />
                      {typeof cData?.images?.upperImage === 'string' && (
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={cData.images.upperImage}
                          />
                        </div>
                      )}
                    </FormItem>

                    <div className="space-y-2">
                      <Label htmlFor="upperTitleEn">Upper English Title</Label>
                      <Input
                        id="upperTitleEn"
                        name="titles.upperTitle.en"
                        placeholder="Enter Upper English Title"
                        value={cData.titles?.upperTitle?.en || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="upperTitleHi">Upper Hindi Title</Label>
                      <Input
                        id="upperTitleHi"
                        name="titles.upperTitle.hi"
                        placeholder="Enter Upper Hindi Title"
                        value={cData.titles?.upperTitle?.hi || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="upperLink">Upper Link</Label>
                      <Input
                        id="upperLink"
                        name="links.upperLink"
                        placeholder="Enter Upper Link URL"
                        value={cData.links?.upperLink || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* LOWER SECTION */}
                  <CardHeader className="flex flex-row items-center justify-center">
                    <CardTitle>LOWER SIDE TITLE / IMAGES / LINKS</CardTitle>
                  </CardHeader>

                  <div className="space-y-4 p-6 pt-0">
                    <FormItem className="space-y-3">
                      <FormLabel>Lower Image</FormLabel>
                      <FileUploader
                        value={lowerImage ? [lowerImage] : []}
                        onValueChange={(newFiles: any) =>
                          handleFileUpload(
                            'images.lowerImage',
                            newFiles,
                            setLowerImage
                          )
                        }
                        accept={{ 'image/*': [] }}
                        maxSize={1024 * 1024 * 2}
                      />
                      {typeof cData?.images?.lowerImage === 'string' && (
                        <div className="max-h-48 space-y-4">
                          <FileViewCard
                            existingImageURL={cData.images.lowerImage}
                          />
                        </div>
                      )}
                    </FormItem>

                    <div className="space-y-2">
                      <Label htmlFor="lowerTitleEn">Lower English Title</Label>
                      <Input
                        id="lowerTitleEn"
                        name="titles.lowerTitle.en"
                        placeholder="Enter Lower English Title"
                        value={cData.titles?.lowerTitle?.en || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lowerTitleHi">Lower Hindi Title</Label>
                      <Input
                        id="lowerTitleHi"
                        name="titles.lowerTitle.hi"
                        placeholder="Enter Lower Hindi Title"
                        value={cData.titles?.lowerTitle?.hi || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lowerLink">Lower Link</Label>
                      <Input
                        id="lowerLink"
                        name="links.lowerLink"
                        placeholder="Enter Lower Link URL"
                        value={cData.links?.lowerLink || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="mb-4 flex justify-center">
          <Button type="submit" onClick={handleSubmit}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </CardFooter>
      </Card>
    </PageContainer>
  );
};

export default Page;

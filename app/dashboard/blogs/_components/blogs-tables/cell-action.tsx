'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
// import { DialogFooter, DialogHeader } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ICountries, deleteTypes } from '@/redux/slices/countriesSlice';
import { deleteFaq } from '@/redux/slices/faqSlice';
import {
  addEditHomeAboutList,
  deleteHomeAboutList,
  IHomeAboutList
} from '@/redux/slices/homeaboutlistSlice';
import { ISliders, deleteSlider } from '@/redux/slices/slidersSlice';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  addEditBlogsPost,
  deleteBlogsPost,
  IBlogsPost
} from '@/redux/slices/blogspostSlice';
import { searchParams } from '@/lib/searchparams';
import slugify from 'slugify';
interface CellActionProps {
  data: IBlogsPost;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open1, setOpen1] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    sequence: data.sequence,
    thumbnail_image: data.thumbnail_image,
    main_image: data.main_image,
    heading: data.heading,
    slug: data.slug,
    short_description: data.short_description,
    long_description: data.long_description,

    status: false
  });
  const [imagePreview, setImagePreview] = useState<Record<string, string>>({
    thumbnail_image: data.thumbnail_image,
    main_image: data.main_image
  });

  const onConfirm = async () => {
    dispatch(deleteBlogsPost(data?._id || ''));
    setOpen(false);
  };

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
        setImagePreview((prev) => ({
          ...prev,
          [name]: imageDataUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    if (formData.heading) {
      const generatedSlug = slugify(formData.heading, {
        lower: true,
        strict: true,
        trim: true
      });
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.heading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('sequence', formData.sequence.toString());
    formDataToSend.append('heading', formData.heading);
    formDataToSend.append('slug', formData.slug);
    formDataToSend.append('short_description', formData.short_description);
    formDataToSend.append('long_description', formData.long_description);
    formDataToSend.append('status', formData.status.toString());
    if (formData.thumbnail_image) {
      formDataToSend.append('thumbnail_image', formData.thumbnail_image);
    }
    if (formData.main_image) {
      formDataToSend.append('main_image', formData.main_image);
    }
    for (let pair of formDataToSend.entries()) {
    }
    dispatch(
      addEditBlogsPost({ formData: formDataToSend, entityId: data._id })
    );
    setImagePreview({});
    setFormData({
      sequence: 0,
      thumbnail_image: '',
      main_image: '',
      short_description: '',
      long_description: '',
      heading: '',
      slug: '',
      status: false
    });
    setOpen(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => {
              // router.push(`/dashboard/home/about?id=${data._id}`)
              setOpen1(true);
            }}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open1} onOpenChange={setOpen1}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Update Post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sequence Input */}
            <div>
              <Label htmlFor="sequence">Sequence</Label>
              <Input
                id="sequence"
                type="number"
                value={formData.sequence}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sequence: Number(e.target.value)
                  })
                }
                required
              />
            </div>

            <div className="flex justify-between">
              <div>
                <Label htmlFor="thumbnail_image">Thumbnail (Image)</Label>
                <Input
                  id="thumbnail_image"
                  name="thumbnail_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                {imagePreview.thumbnail_image && (
                  <img
                    src={imagePreview.thumbnail_image}
                    alt="Preview"
                    className="mt-2 h-20 w-20 rounded-lg shadow-md"
                  />
                )}
              </div>

              <div>
                <Label htmlFor="main_image">Main (Image)</Label>
                <Input
                  id="main_image"
                  name="main_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                {imagePreview.main_image && (
                  <img
                    src={imagePreview.main_image}
                    alt="Preview"
                    className="mt-2 h-20 w-20 rounded-lg shadow-md"
                  />
                )}
              </div>
            </div>

            {/* Title Input */}
            <div className=" flex justify-between">
              <div>
                <Label htmlFor="heading">Heading</Label>
                <Input
                  id="heading"
                  value={formData.heading}
                  onChange={(e) =>
                    setFormData({ ...formData, heading: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="heading">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="short_description">Short Description</Label>
              <Input
                id="short_description"
                type="text"
                value={formData.short_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    short_description: e.target.value
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="long_description">Long Description</Label>
              <Input
                id="long_description"
                type="text"
                value={formData.long_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    long_description: e.target.value
                  })
                }
                required
              />
            </div>

            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

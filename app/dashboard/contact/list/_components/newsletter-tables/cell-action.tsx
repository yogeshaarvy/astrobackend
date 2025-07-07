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
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { IContactUs } from '@/redux/slices/contact/contactSlice';
interface CellActionProps {
  data: IContactUs;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open1, setOpen1] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  // const [formData, setFormData] = useState({
  //   sequence: data.sequence,
  //   icon: data.icon,
  //   title: data.title,
  //   status: data.status
  // });
  // const [imagePreview, setImagePreview] = useState<string | null>(data.icon);

  // const onConfirm = async () => {
  //   dispatch(deleteHomeAboutList(data?._id || ''));
  //   setOpen(false);
  // };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setFormData({ ...formData, icon: file });
  //     // setFormData({ ...formData, icon: URL.createObjectURL(file) });
  //     setImagePreview(URL.createObjectURL(file));
  //   }
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const formDataToSend = new FormData();
  //   formDataToSend.append('sequence', formData.sequence.toString());
  //   formDataToSend.append('title', formData.title);
  //   formDataToSend.append('status', formData.status.toString());
  //   if (formData.icon) {
  //     formDataToSend.append('icon', formData.icon);
  //   }
  //   dispatch(
  //     addEditHomeAboutList({ formData: formDataToSend, entityId: data._id })
  //   );
  //   setOpen1(false);
  // };

  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      /> */}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          {/* <form onSubmit={handleSubmit} className="space-y-4"> */}
          {/* Sequence Input */}
          {/* <div>
              <Label htmlFor="sequence">Sequence</Label>
              <Input
                id="sequence"
                type="number"
                value={formData.sequence}
                onChange={(e) =>
                  setFormData({ ...formData, sequence: Number(e.target.value) })
                }
                required
              />
            </div> */}

          {/* Icon Input (File) */}
          {/* <div>
              <Label htmlFor="icon">Icon (Image)</Label>
              <Input
                id="icon"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 h-20 w-20 rounded-lg shadow-md"
                />
              )}
            </div> */}

          {/* Title Input */}
          {/* <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form> */}
        </DialogContent>
      </Dialog>
    </>
  );
};

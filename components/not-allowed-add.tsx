import React from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type Props = {
  label?: string;
  isIconVisilbe?: boolean;
  name?: string;
};

export default function EmployeeNotAllowedToAdd({
  label,
  isIconVisilbe,
  name
}: Props) {
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>
            {isIconVisilbe && <Plus className="mr-2 h-4 w-4" />} {label}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permission Denied</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            You do not have permission to add {name}. Please contact the
            administrator for access.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

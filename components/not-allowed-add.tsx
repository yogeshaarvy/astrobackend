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

export default function EmployeeNotAllowedToAdd() {
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Permission Denied</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            You do not have permission to add new employee. Please contact the
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

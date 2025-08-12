'use client';
import { toast } from 'sonner';

export const handleReduxResponse =
  (successMessage?: string) => (resultAction: any) => {
    if (resultAction?.error) {
      toast.error(resultAction.payload);
      return resultAction.payload;
    }
    if (successMessage) {
      toast.success(successMessage);
    }
  };

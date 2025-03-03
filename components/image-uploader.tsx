import React, { useState } from 'react';
import { Button } from './ui/button';

interface ImageUploadProps {
  images: File[] | File | null; // Images prop can be a single image or an array of images
  onChange: (files: File[]) => void; // onChange callback to handle the updated image list
  multiple?: boolean; // Optional prop to enable multiple file uploads
  label: string; // Label for the upload input
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onChange,
  multiple = false,
  label
}) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Handle file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    onChange(fileArray); // Update parent component with the selected files

    // Generate preview URLs
    const previews = fileArray.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Handle removing an image
  const handleRemoveImage = (index: number) => {
    const updatedImages = Array.isArray(images) ? [...images] : [images];
    updatedImages.splice(index, 1);
    onChange(updatedImages); // Update parent component with the modified list
    setImagePreviews(updatedImages.map((file) => URL.createObjectURL(file)));
  };

  // Handle clearing all images
  const handleClearImages = () => {
    onChange([]); // Clear all images
    setImagePreviews([]);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        multiple={multiple}
        className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
      />

      {/* Image Previews */}
      <div className="mt-4 flex flex-wrap gap-4">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="relative h-40 w-40">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full rounded-lg border object-cover"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute right-0 top-0 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Clear All Images Button */}
      {images && Array.isArray(images) && images.length > 0 && (
        <Button onClick={handleClearImages} className="mt-4 text-red-600">
          Clear All Images
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;

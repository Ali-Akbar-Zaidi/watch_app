'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  darkMode: boolean;
}

export default function ImageUpload({ currentImage, onImageChange, darkMode }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentImage || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setPreview(base64String);
        onImageChange(base64String);
        setIsUploading(false);
      };
      reader.onerror = () => {
        alert('Error reading file');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Product Image
      </label>
      
      <div className="flex flex-col space-y-4">
        {/* Image Preview */}
        {preview && (
          <div className="relative">
            <img
              src={preview}
              alt="Product preview"
              className="w-full h-48 object-cover rounded-xl border border-gray-300"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex flex-col space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isUploading}
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`w-full px-4 py-3 rounded-xl border-2 border-dashed transition-colors ${
              darkMode 
                ? 'border-gray-600 hover:border-gray-500 bg-gray-700 text-white' 
                : 'border-gray-300 hover:border-gray-400 bg-gray-50 text-gray-700'
            } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-opacity-80'}`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="text-2xl">📷</div>
              <div className="text-sm">
                {isUploading ? 'Uploading...' : (preview ? 'Change Image' : 'Upload Image')}
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                PNG, JPG, GIF up to 5MB
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
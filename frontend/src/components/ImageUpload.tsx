import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import uploadService from '../services/uploadService';

interface ImageUploadProps {
  onUploadComplete: (urls: string[]) => void;
  maxImages?: number;
  folder?: string;
  existingImages?: string[];
}

export function ImageUpload({ 
  onUploadComplete, 
  maxImages = 5, 
  folder = '/products',
  existingImages = []
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(existingImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;
    
    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    // Show previews immediately
    const newPreviews = await Promise.all(
      files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      })
    );
    
    setPreviews([...previews, ...newPreviews]);
    setUploading(true);

    try {
      if (files.length === 1) {
        const result = await uploadService.uploadImage(files[0], folder);
        const newImages = [...images, result.data.url];
        setImages(newImages);
        onUploadComplete(newImages);
      } else {
        const result = await uploadService.uploadMultipleImages(files, folder);
        const newUrls = result.data.map((img: any) => img.url);
        const newImages = [...images, ...newUrls];
        setImages(newImages);
        onUploadComplete(newImages);
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(error.response?.data?.message || 'Failed to upload images');
      // Remove failed previews
      setPreviews(previews);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
    onUploadComplete(newImages);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleClick}
          disabled={uploading || images.length >= maxImages}
          className="px-6 py-3 bg-[#FF3B30] text-white rounded-lg hover:bg-[#007AFF] transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload Images
            </>
          )}
        </button>
        <span className="text-gray-600 text-sm">
          {images.length} / {maxImages} images
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-[#FF3B30] text-white text-xs rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {previews.length === 0 && (
        <div 
          onClick={handleClick}
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-[#FF3B30] transition-colors"
        >
          <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">Click to upload images</p>
          <p className="text-gray-400 text-sm">PNG, JPG, WEBP up to 10MB</p>
        </div>
      )}
    </div>
  );
}

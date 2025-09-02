import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { CloudUpload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface FileUploadProps {
  onFileUpload: (imageUrl: string) => void;
  onClose: () => void;
}

export function FileUpload({ onFileUpload, onClose }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onFileUpload(data.imageUrl);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [onFileUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'application/pdf': ['.pdf'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-foreground">Upload Problem Image</h3>
        <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-upload">
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div
        {...getRootProps()}
        className={`upload-dropzone rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragActive ? 'drag-over' : ''
        }`}
        data-testid="dropzone-file-upload"
      >
        <input {...getInputProps()} />
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CloudUpload className="text-primary text-2xl" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {isDragActive ? 'Drop the file here' : 'Upload Problem Image'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {isDragActive 
              ? 'Release to upload the file'
              : 'Drag and drop an image of your homework problem, or click to browse.'
            }
          </p>
          {!isDragActive && (
            <Button 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              disabled={isUploading}
              data-testid="button-choose-file"
            >
              {isUploading ? 'Uploading...' : 'Choose File'}
            </Button>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Supports JPG, PNG, WebP, and PDF files up to 10MB
          </p>
        </div>
      </div>
    </div>
  );
}

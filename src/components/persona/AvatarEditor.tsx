
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, RefreshCw } from "lucide-react";

const AvatarEditor = () => {
  // Placeholder for image generation functionality
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center">
        <div className="w-48 h-48 rounded-full bg-secondary flex items-center justify-center overflow-hidden mb-4">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <Upload className="w-12 h-12 text-muted-foreground" />
          )}
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="w-40">
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              Upload Image
            </Label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </Button>

          <Button variant="outline" className="w-40">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate
          </Button>
        </div>
      </div>

      {/* Placeholder for style controls */}
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          More customization options coming soon...
        </p>
      </div>
    </div>
  );
};

export default AvatarEditor;

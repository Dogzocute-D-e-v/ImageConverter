'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Image as ImageIcon, Download, Trash2, Link } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<string>('png');
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setConvertedUrl(null);
      setImageUrl('');
    }
  };

  const handleUrlSubmit = async () => {
    if (!imageUrl) return;
    setIsLoading(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: blob.type });
      setSelectedFile(file);
      setPreviewUrl(imageUrl);
      setConvertedUrl(null);
    } catch (error) {
      console.error('Error loading image from URL:', error);
    }
    setIsLoading(false);
  };

  const handleConvert = async () => {
    if (!selectedFile && !imageUrl) return;
    setIsLoading(true);

    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
    } else if (imageUrl) {
      formData.append('imageUrl', imageUrl);
    }
    formData.append('format', format);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Conversion failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setConvertedUrl(url);
    } catch (error) {
      console.error('Error converting image:', error);
    }
    setIsLoading(false);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setConvertedUrl(null);
    setImageUrl('');
  };

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-lg border-none text-white">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-4">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Or paste image URL here..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border-none text-white placeholder:text-gray-400"
            />
            <Button 
              onClick={handleUrlSubmit}
              disabled={!imageUrl || isLoading}
              className="w-full"
              variant="secondary"
            >
              <Link className="w-4 h-4 mr-2" />
              Load from URL
            </Button>
          </div>

          <div className="relative">
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                'hover:border-primary cursor-pointer',
                'flex flex-col items-center justify-center min-h-[300px]',
                selectedFile ? 'border-primary' : 'border-gray-600'
              )}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-[250px] rounded-lg object-contain"
                />
              ) : (
                <>
                  <Upload className="w-12 h-12 mb-4 text-gray-400" />
                  <p className="text-gray-300">Click or drag image to upload</p>
                  <p className="text-sm text-gray-400 mt-2">Supports PNG, JPG, WEBP, GIF, TIFF</p>
                </>
              )}
            </div>
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
          
          {selectedFile && (
            <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <ImageIcon className="w-5 h-5 text-primary" />
                <span className="text-sm truncate max-w-[200px]">
                  {selectedFile.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="text-gray-400 hover:text-red-400"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Convert Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-300">
              Convert to:
            </label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="w-full bg-white/5 border-none">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG (Recommended)</SelectItem>
                <SelectItem value="webp">WEBP</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
                <SelectItem value="avif">AVIF</SelectItem>
                <SelectItem value="tiff">TIFF</SelectItem>
                <SelectItem value="gif">GIF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleConvert}
            disabled={(!selectedFile && !imageUrl) || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Converting...
              </span>
            ) : (
              'Convert Image'
            )}
          </Button>

          {convertedUrl && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-white/5">
                <img
                  src={convertedUrl}
                  alt="Converted"
                  className="max-h-[200px] mx-auto rounded-lg object-contain"
                />
              </div>
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = convertedUrl;
                  link.download = `converted.${format}`;
                  link.click();
                }}
              >
                <Download className="w-5 h-5 mr-2" />
                Download Converted Image
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
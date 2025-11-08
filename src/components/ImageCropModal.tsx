import { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Loader2, Maximize2, Minimize2 } from 'lucide-react';

interface ImageCropModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageFile: File | null;
  onCropComplete: (croppedFile: File) => void;
}

const ImageCropModal = ({ open, onOpenChange, imageFile, onCropComplete }: ImageCropModalProps) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState<string>('');

  // Load image when file changes
  useState(() => {
    if (imageFile && open) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  });

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const aspect = width / height;
    
    // Set initial crop to full image
    setCrop({
      unit: '%',
      width: 90,
      height: 90 / aspect,
      x: 5,
      y: 5,
    });
  }, []);

  const getCroppedImg = useCallback(
    async (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('No 2d context');
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Calculate final dimensions respecting max width
      let finalWidth = crop.width * scaleX;
      let finalHeight = crop.height * scaleY;
      
      if (finalWidth > maxWidth) {
        const ratio = maxWidth / finalWidth;
        finalWidth = maxWidth;
        finalHeight = finalHeight * ratio;
      }

      canvas.width = finalWidth;
      canvas.height = finalHeight;

      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        finalWidth,
        finalHeight
      );

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'));
              return;
            }
            resolve(blob);
          },
          'image/jpeg',
          0.9
        );
      });
    },
    [maxWidth]
  );

  const handleCropApply = async () => {
    if (!completedCrop || !imgRef.current || !imageFile) {
      toast.error('Please select a crop area');
      return;
    }

    setIsProcessing(true);
    try {
      const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
      const croppedFile = new File([croppedImageBlob], imageFile.name, {
        type: 'image/jpeg',
      });
      
      onCropComplete(croppedFile);
      toast.success('Image optimized successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Failed to crop image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkipCrop = () => {
    if (imageFile) {
      onCropComplete(imageFile);
      onOpenChange(false);
    }
  };

  const setPresetCrop = (aspect: number) => {
    if (!imgRef.current) return;
    
    const { width, height } = imgRef.current;
    const imageAspect = width / height;
    
    let cropWidth, cropHeight;
    
    if (imageAspect > aspect) {
      cropHeight = 90;
      cropWidth = (cropHeight * aspect * height) / width;
    } else {
      cropWidth = 90;
      cropHeight = (cropWidth / aspect * width) / height;
    }
    
    setCrop({
      unit: '%',
      width: cropWidth,
      height: cropHeight,
      x: (100 - cropWidth) / 2,
      y: (100 - cropHeight) / 2,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crop & Optimize Image</DialogTitle>
          <DialogDescription>
            Adjust the crop area and resize settings to optimize your image for web display
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Aspect Ratio Presets */}
          <div className="flex gap-2 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPresetCrop(16 / 9)}
            >
              16:9 (Landscape)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPresetCrop(4 / 3)}
            >
              4:3
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPresetCrop(1)}
            >
              1:1 (Square)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPresetCrop(9 / 16)}
            >
              9:16 (Portrait)
            </Button>
          </div>

          {/* Crop Area */}
          {imageSrc && (
            <div className="max-h-[400px] overflow-auto border rounded-lg">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Crop preview"
                  style={{ transform: `scale(${scale})` }}
                  onLoad={onImageLoad}
                  className="max-w-full"
                />
              </ReactCrop>
            </div>
          )}

          {/* Controls */}
          <div className="space-y-4">
            <div>
              <Label>Zoom: {scale.toFixed(1)}x</Label>
              <Slider
                value={[scale]}
                onValueChange={([value]) => setScale(value)}
                min={0.5}
                max={3}
                step={0.1}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="max-width">Max Width (px)</Label>
              <Input
                id="max-width"
                type="number"
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value))}
                min={320}
                max={3840}
                step={160}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Images wider than this will be resized. Recommended: 1920px for full-width images, 1200px for content images.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSkipCrop}
            disabled={isProcessing}
          >
            Skip Crop
          </Button>
          <Button
            onClick={handleCropApply}
            disabled={isProcessing || !completedCrop}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Apply & Upload'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropModal;

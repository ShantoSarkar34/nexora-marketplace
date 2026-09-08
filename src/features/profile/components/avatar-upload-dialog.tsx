"use client";

import { useCallback, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { RotateCcw, RotateCw, Upload, ZoomIn } from "lucide-react";
import { toast } from "sonner";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCroppedImageBlob } from "@/lib/crop-image";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AvatarUploadDialog({ open, onOpenChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  }

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  function reset() {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSave() {
    if (!imageSrc || !croppedAreaPixels) return;
    setIsUploading(true);
    try {
      // Produce the final cropped/rotated image client-side so it's ready
      // to send the moment real upload is wired up.
      await getCroppedImageBlob(imageSrc, croppedAreaPixels, rotation);

      // TODO: send the blob to ImgBB (or your chosen host) once the upload
      // endpoint/API key is configured, then PATCH /auth/me with the
      // returned direct image URL.
      toast.info("Image upload is currently unavailable — check back soon.");
      reset();
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong processing the image.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleClose() {
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose} title="Update profile photo">
      {!imageSrc ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="bg-surface-muted text-text-secondary flex h-14 w-14 items-center justify-center rounded-full">
            <Upload className="h-6 w-6" />
          </div>
          <p className="text-text-secondary text-sm">
            Choose an image to upload
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button type="button" onClick={() => fileInputRef.current?.click()}>
            Select Image
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-surface-muted relative h-72 w-full overflow-hidden rounded-md">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <ZoomIn className="text-text-secondary h-4 w-4" />
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="accent-brand-600 flex-1"
                aria-label="Zoom"
              />
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setRotation((r) => r - 90)}
                aria-label="Rotate left"
                className="border-border text-text-secondary hover:bg-surface-muted flex h-9 w-9 items-center justify-center rounded-md border"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setRotation((r) => r + 90)}
                aria-label="Rotate right"
                className="border-border text-text-secondary hover:bg-surface-muted flex h-9 w-9 items-center justify-center rounded-md border"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} isLoading={isUploading}>
              Save Photo
            </Button>
            <Button type="button" variant="secondary" onClick={reset}>
              Choose Different Image
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}

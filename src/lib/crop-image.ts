interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

export async function getCroppedImageBlob(
  imageSrc: string,
  cropArea: CropArea,
  rotation = 0,
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  const radians = (rotation * Math.PI) / 180;

  // Draw rotated image onto an intermediate canvas sized to fit the rotation
  const rotatedCanvas = document.createElement("canvas");
  const rotatedCtx = rotatedCanvas.getContext("2d");
  if (!rotatedCtx) throw new Error("Could not get canvas context");

  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  rotatedCanvas.width = image.width * cos + image.height * sin;
  rotatedCanvas.height = image.width * sin + image.height * cos;

  rotatedCtx.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);
  rotatedCtx.rotate(radians);
  rotatedCtx.drawImage(image, -image.width / 2, -image.height / 2);

  canvas.width = cropArea.width;
  canvas.height = cropArea.height;

  ctx.drawImage(
    rotatedCanvas,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas is empty"));
      },
      "image/jpeg",
      0.9,
    );
  });
}

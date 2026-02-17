"use client";

import { useState, useRef } from "react";
import { Upload, ImageIcon, X } from "lucide-react";
import NextImage from "next/image";

export default function ImageUpload({
  onImageProcessed,
}: {
  onImageProcessed: (file: File) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Basic Validation
    if (!file.type.startsWith("image/")) {
      alert("Por favor sube una imagen válida.");
      return;
    }

    // 2. Process/Crop using Canvas
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Target Resolution: 800x600 (4:3 ratio)
        canvas.width = 800;
        canvas.height = 600;

        if (ctx) {
          // Logic: Center Crop
          const ratio = Math.max(
            canvas.width / img.width,
            canvas.height / img.height,
          );
          const x = (canvas.width - img.width * ratio) / 2;
          const y = (canvas.height - img.height * ratio) / 2;

          ctx.drawImage(img, x, y, img.width * ratio, img.height * ratio);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const processedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                });
                setPreview(URL.createObjectURL(processedFile));
                onImageProcessed(processedFile);
              }
            },
            "image/jpeg",
            0.8,
          );
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-[#283618]">
        Imagen del Producto (800x600)
      </label>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative h-48 w-full border-2 border-dashed border-[#DDA15E] rounded-xl flex flex-col items-center justify-center bg-white hover:bg-orange-50 cursor-pointer transition-colors overflow-hidden"
      >
        {preview ? (
          <NextImage
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
        ) : (
          <>
            <Upload className="text-[#BC6C25] mb-2" />
            <span className="text-xs text-gray-500">Click para subir foto</span>
          </>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
}

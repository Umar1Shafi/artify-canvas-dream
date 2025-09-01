// src/components/UploadCard.tsx
import React, { useCallback, useRef, useState } from "react";
import "@/styles/artmorph.css";
import { fileToDataURI } from "@/lib/api";

type Props = {
  imageDataUri: string | null;
  onFileSelected: (file: File) => void;
};

export default function UploadCard({ imageDataUri, onFileSelected }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [drag, setDrag] = useState(false);

  const handleFiles = useCallback((files: FileList | null) => {
    const f = files?.[0]; if (!f) return;
    if (f.size > 10 * 1024 * 1024) { alert("Max 10 MB image."); return; }
    onFileSelected(f);
  }, [onFileSelected]);

  return (
    <div className="am-card p-4">
      <div className="text-lg font-semibold mb-2">Upload Your Photo</div>
      <div
        className={`am-dashed flex items-center justify-center aspect-[4/3] bg-white ${drag ? "bg-teal-50" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        role="button"
        aria-label="Upload image"
      >
        {imageDataUri ? (
          <img src={imageDataUri} className="max-h-full max-w-full object-contain rounded-md shadow-sm" />
        ) : (
          <div className="text-center px-4 py-6">
            <div className="mx-auto h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center mb-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 16V4m0 0l-4 4m4-4l4 4" stroke="#14B8A6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 16.5v1a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 17.5v-1" stroke="#14B8A6" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </div>
            <div className="font-medium">Drop your image here</div>
            <div className="text-sm opacity-70">or click to browse from your device</div>
            <div className="text-xs opacity-60 mt-1">Supports JPG, PNG, WebP • Max size: 10MB</div>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {imageDataUri && (
        <div className="mt-3 text-sm text-teal-700 bg-teal-50 border border-teal-200 rounded-md px-3 py-2">
          <b>Photo uploaded!</b> Ready to apply artistic style.
        </div>
      )}
    </div>
  );
}

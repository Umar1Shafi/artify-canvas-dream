import React, { useCallback } from "react";

export default function UploadSection({
  imageDataUri,
  onFileSelected,
}: {
  imageDataUri: string | null;
  onFileSelected: (file: File) => void;
}) {
  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) onFileSelected(files[0]);
  }, [onFileSelected]);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const TEN_MB = 10 * 1024 * 1024;
    if (f.size > TEN_MB) {
      alert("Please select an image ≤ 10 MB.");
      e.currentTarget.value = "";
      return;
    }
    onFileSelected(f);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className="bg-white/80 backdrop-blur rounded-xl border border-teal-200 hover:border-teal-400 transition-colors p-4"
    >
      <div className="mb-3 font-semibold">Upload Your Photo</div>
      {imageDataUri ? (
        <div className="relative group">
          <img src={imageDataUri} className="w-full max-h-80 object-contain rounded-lg border shadow-sm" />
          <label className="absolute top-3 right-3 px-3 py-1.5 bg-black/70 text-white text-xs rounded cursor-pointer hover:bg-black">
            Change
            <input type="file" accept="image/*" className="hidden" onChange={onPick} />
          </label>
        </div>
      ) : (
        <label className="block">
          <div className="border-2 border-dashed rounded-lg p-8 text-center text-slate-600 cursor-pointer hover:bg-slate-50">
            <div className="text-lg font-medium mb-1">Drop your image here</div>
            <div className="text-sm">or click to browse (JPG/PNG/WebP, ≤10MB)</div>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={onPick} />
        </label>
      )}
    </div>
  );
}

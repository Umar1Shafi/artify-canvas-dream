import React from "react";
import {
  Palette,
  Upload as UploadIcon,
  Sparkles,
  Download,
  Info,
  type LucideIcon, // ✅ proper icon type
} from "lucide-react";

type Step = "upload" | "stylize" | "result";

export default function PrevHeader({
  currentStep,
  onStepChange,
  onHelp,
}: {
  currentStep: Step;
  onStepChange: (s: Step) => void;
  onHelp: () => void;
}) {
  // ✅ Use LucideIcon instead of any
  const steps: { id: Step; label: string; Icon: LucideIcon }[] = [
    { id: "upload", label: "Upload & Style", Icon: UploadIcon },
    { id: "stylize", label: "Stylize (Preview)", Icon: Sparkles },
    { id: "result", label: "Result", Icon: Download },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-teal-700" />
          <div className="text-base md:text-lg font-semibold bg-gradient-to-r from-teal-700 to-purple-800 bg-clip-text text-transparent">
            Artify Canvas Dream
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-2 text-sm">
          {steps.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => onStepChange(id)}
              className={[
                "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all",
                currentStep === id
                  ? "bg-teal-100 text-teal-800 border border-teal-300"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.split(" ")[0]}</span>
            </button>
          ))}

          <button
            onClick={onHelp}
            className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white hover:bg-slate-50"
            aria-label="How it works"
          >
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">How it works</span>
            <span className="sm:hidden">Help</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

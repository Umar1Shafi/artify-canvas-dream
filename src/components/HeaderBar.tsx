// src/components/HeaderBar.tsx
import React from "react";
import "@/styles/artmorph.css";
import StepperPills from "./StepperPills";

export default function HeaderBar({ step }: { step: 1 | 2 | 3 }) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="am-shell flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-400 to-indigo-500" />
          <div>
            <div className="text-lg font-semibold">Artify Canvas</div>
            <div className="text-[11px] opacity-60 -mt-0.5">AI-Powered Style Transfer</div>
          </div>
        </div>

        <div className="hidden md:block">
          <StepperPills step={step} />
        </div>

        <div className="flex items-center gap-2">
          <a className="am-btn-ghost text-sm" href="#" onClick={(e)=>e.preventDefault()}>How it works</a>
          <a className="am-btn-ghost text-sm" href="#" onClick={(e)=>e.preventDefault()}>Professional AI Art Tool</a>
        </div>
      </div>
    </header>
  );
}

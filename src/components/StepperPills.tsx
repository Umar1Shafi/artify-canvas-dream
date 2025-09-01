// src/components/StepperPills.tsx
import React from "react";
import "@/styles/artmorph.css";

type Step = 1 | 2 | 3;

export default function StepperPills({ step }: { step: Step }) {
  const item = (n: Step, label: string) => (
    <div className="step-pill">
      <div className={`step-dot ${step === n ? "active" : ""}`}>{n}</div>
      <span>{label}</span>
    </div>
  );
  return (
    <div className="flex items-center gap-3">
      {item(1, "Upload & Style")}
      <div className="opacity-40">—</div>
      {item(2, "Stylize")}
      <div className="opacity-40">—</div>
      {item(3, "Download")}
    </div>
  );
}

// I guide the user from uploading a photo to picking a style, then I send them to the Stylize page.

import React, { useState } from "react";

// UI bits I already built
import { Header } from "@/components/Header"; // I show the 3-step header
import UploadSection from "@/components/UploadSection"; // I let the user pick an image
import { StyleGallery } from "@/components/p1/StyleGallery"; // I pick one backend style
import { ControlPanel as P1ControlPanel } from "@/components/p1/ControlPanel"; // (unused here)
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Types / routing / tiny session store
import type { StylizeRequest, Style, Subject, Control, Mode } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { saveSession } from "@/lib/session";

// My step type matches the Header
type Step = "upload" | "stylize" | "result";

// I convert a File to a data:URI so the backend can read it later
function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result || ""));
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

export default function Index() {
  // I keep track of which step the header highlights
  const [currentStep, setCurrentStep] = useState<Step>("upload");

  // I store the uploaded image as a data URI
  const [contentImage, setContentImage] = useState<string>("");

  // Backend knobs (simple defaults so beginners don’t get lost)
  const [style, setStyle] = useState<Style>("cinematic");
  const [subject] = useState<Subject>("scene");
  const [control] = useState<Control>("auto");
  const [strength] = useState<number>(0.3);
  const [guidance] = useState<number>(6.5);
  const [maxSide] = useState<number>(1024);
  const [seed] = useState<number>(0);
  const stepsPreview = 18; // I use a lighter preview by default
  const navigate = useNavigate();

  // When the user picks a file, I turn it into a data:URI
  const handleFileSelected = async (file: File) => {
    try {
      const uri = await fileToDataURL(file);
      setContentImage(uri);
    } catch {
      alert("Could not read file. Please try another image.");
    }
  };

  // The style gallery tells me which backend style to use
  const handleStyleSelect = (s: Style) => {
    setStyle(s);
  };

  const canStart = Boolean(contentImage);

  // I stash inputs in session and move to the next page
  const runStylize = (_mode: Mode) => {
    if (!contentImage) {
      alert("Please upload an image first.");
      return;
    }
    saveSession({ contentImage, style, subject, control });
    navigate("/stylize");
  };

  return (
    <div className="min-h-screen bg-artmorph">
      {/* I show the simple 3-step header at the top */}
      <Header
        currentStep={currentStep}
        onStepChange={(s: Step) => setCurrentStep(s)}
      />

      {/* Tiny hero so folks know what to do */}
      <section className="max-w-5xl mx-auto text-center px-4 pt-8 pb-2">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
          Transform Your Photos
        </h1>
        <p className="text-slate-600 mt-2">
          Upload your photo and choose an artistic style to create stunning
          artwork in seconds
        </p>
      </section>

      {/* Two columns: upload on the left, styles on the right */}
      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: upload box */}
        <div className="lg:col-span-6">
          <Card>
            <CardContent className="p-4 md:p-6">
              <UploadSection
                imageDataUri={contentImage}
                onFileSelected={handleFileSelected}
              />
              {contentImage && (
                <div className="mt-3 text-sm rounded-md border border-emerald-200 bg-emerald-50 text-emerald-800 px-3 py-2">
                  Photo uploaded! Ready to apply artistic style.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: style picker */}
        <div className="lg:col-span-6">
          <Card>
            <CardContent className="p-4 md:p-6">
              <StyleGallery selected={style} onSelect={handleStyleSelect} />
              <div className="mt-3 text-sm rounded-md border border-purple-200 bg-purple-50 text-purple-800 px-3 py-2">
                Selected style: <b>{style}</b>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Big “go” button */}
      <section className="max-w-7xl mx-auto px-4 pb-4 flex justify-center">
        <Button
          onClick={() => runStylize("preview")}
          disabled={!canStart}
          className="px-6 py-3 text-base md:text-lg"
        >
          Start Stylization →
        </Button>
      </section>
    </div>
  );
}

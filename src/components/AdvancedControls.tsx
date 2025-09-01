import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import type { Style, Subject, Control } from "@/lib/api";

const pct = (v:number)=>`${Math.round(v*100)}%`;

type Props = {
  style: Style;

  // Common
  subject: Subject; onSubject: (v:Subject)=>void;
  control: Control; onControl: (v:Control)=>void;
  strength: number; onStrength: (v:number)=>void;
  guidance: number; onGuidance: (v:number)=>void;
  stepsPreview: number; onStepsPreview: (v:number)=>void;
  stepsFull: number; onStepsFull: (v:number)=>void;
  maxSide: number; onMaxSide: (v:number)=>void;
  seed: number; onSeed: (v:number)=>void;
  controlScale: number; onControlScale:(v:number)=>void;

  // Cyberpunk
  styleStrength: number; onStyleStrength:(v:number)=>void;
  neon: number; onNeon:(v:number)=>void;
  bloom: number; onBloom:(v:number)=>void;
  rimBoost: number; onRimBoost:(v:number)=>void;
  scanlines: number; onScanlines:(v:number)=>void;
  edgeQ: number; onEdgeQ:(v:number)=>void;
  skinSuppress: number; onSkinSuppress:(v:number)=>void;
  skinKeep: number; onSkinKeep:(v:number)=>void;
  refine: boolean; onRefine:(v:boolean)=>void;
  refineStrength: number; onRefineStrength:(v:number)=>void;
  scheduler: "dpmpp"|"unipc"; onScheduler:(v:"dpmpp"|"unipc")=>void;

  // Noir
  noirHalation: number; onNoirHalation:(v:number)=>void;
  noirBloomSigma: number; onNoirBloomSigma:(v:number)=>void;
  noirBloomThresh: number; onNoirBloomThresh:(v:number)=>void;
  noirVignette: number; onNoirVignette:(v:number)=>void;
  noirDither: number; onNoirDither:(v:number)=>void;
  noirGamma: number; onNoirGamma:(v:number)=>void;
  noirGain: number; onNoirGain:(v:number)=>void;
  noirLift: number; onNoirLift:(v:number)=>void;

  // Cinematic
  toneMix: number; onToneMix:(v:number)=>void;
  cinBloom: number; onCinBloom:(v:number)=>void;
  contrast: number; onContrast:(v:number)=>void;
  saturation: number; onSaturation:(v:number)=>void;
};

export default function AdvancedControls(p: Props) {
  return (
    <Card className="mt-4">
      <CardContent className="p-4 md:p-6 space-y-6">

        {/* Common */}
        <section className="space-y-3">
          <h3 className="font-semibold">Common</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Subject</Label>
              <Select value={p.subject} onValueChange={(v: string) => p.onSubject(v as Subject)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="scene">Scene</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Control</Label>
              <Select value={p.control} onValueChange={(v: string) => p.onControl(v as Control)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="hed">HED</SelectItem>
                  <SelectItem value="depth">Depth</SelectItem>
                  <SelectItem value="canny">Canny</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>Strength — {pct(p.strength)}</Label>
              <Slider value={[p.strength]} min={0} max={1} step={0.01} onValueChange={v=>p.onStrength(v[0])}/>
            </div>
            <div>
              <Label>Guidance — {p.guidance.toFixed(1)}</Label>
              <Slider value={[p.guidance]} min={3} max={12} step={0.1} onValueChange={v=>p.onGuidance(v[0])}/>
            </div>
            <div>
              <Label>Control Scale — {pct(p.controlScale)}</Label>
              <Slider value={[p.controlScale]} min={0} max={1} step={0.01} onValueChange={v=>p.onControlScale(v[0])}/>
            </div>
            <div>
              <Label>Preview Steps</Label>
              <Input type="number" value={p.stepsPreview} onChange={e=>p.onStepsPreview(parseInt(e.target.value||"18",10))}/>
            </div>
            <div>
              <Label>Full Steps</Label>
              <Input type="number" value={p.stepsFull} onChange={e=>p.onStepsFull(parseInt(e.target.value||"36",10))}/>
            </div>
            <div>
              <Label>Max Side (px)</Label>
              <Input type="number" value={p.maxSide} onChange={e=>p.onMaxSide(parseInt(e.target.value||"1024",10))}/>
            </div>
            <div>
              <Label>Seed</Label>
              <Input type="number" value={p.seed} onChange={e=>p.onSeed(parseInt(e.target.value||"0",10))}/>
            </div>
          </div>
        </section>

        {/* Cyberpunk */}
        {p.style==="cyberpunk" && (
          <section className="space-y-3">
            <h3 className="font-semibold">Cyberpunk</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <L label="Style Strength" v={p.styleStrength} set={p.onStyleStrength}/>
              <L label="Neon" v={p.neon} set={p.onNeon}/>
              <L label="Bloom" v={p.bloom} set={p.onBloom}/>
              <L label="Rim Boost" v={p.rimBoost} set={p.onRimBoost}/>
              <L label="Scanlines" v={p.scanlines} set={p.onScanlines}/>
              <L label={"Edge Q ("+p.edgeQ.toFixed(3)+")"} v={p.edgeQ} set={x=>p.onEdgeQ(Number(x.toFixed(3)))} min={0.90} max={0.995} step={0.001}/>
              <L label="Skin Suppress" v={p.skinSuppress} set={p.onSkinSuppress}/>
              <L label="Skin Keep" v={p.skinKeep} set={p.onSkinKeep}/>
              <div className="flex items-center gap-3"><Switch checked={p.refine} onCheckedChange={p.onRefine}/><Label>Refine</Label></div>
              <L label="Refine Strength" v={p.refineStrength} set={p.onRefineStrength}/>
              <div>
                <Label>Scheduler</Label>
                <Select value={p.scheduler} onValueChange={(v: string) => p.onScheduler(v as "dpmpp" | "unipc")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dpmpp">dpmpp</SelectItem>
                    <SelectItem value="unipc">unipc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
        )}

        {/* Noir */}
        {p.style==="noir" && (
          <section className="space-y-3">
            <h3 className="font-semibold">Noir</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <L label="Halation" v={p.noirHalation} set={p.onNoirHalation}/>
              <L label={"Bloom Sigma ("+p.noirBloomSigma.toFixed(2)+")"} v={p.noirBloomSigma} set={p.onNoirBloomSigma} min={0} max={3} step={0.01}/>
              <L label="Bloom Thresh" v={p.noirBloomThresh} set={p.onNoirBloomThresh}/>
              <L label="Vignette" v={p.noirVignette} set={p.onNoirVignette} max={0.5} step={0.005}/>
              <L label={"Dither ("+p.noirDither.toFixed(4)+")"} v={p.noirDither} set={x=>p.onNoirDither(Number(x.toFixed(4)))} min={0} max={0.01} step={0.0005}/>
              <L label={"Gamma ("+p.noirGamma.toFixed(2)+")"} v={p.noirGamma} set={x=>p.onNoirGamma(Number(x.toFixed(2)))} min={0.8} max={1.2} step={0.01}/>
              <L label={"Gain ("+p.noirGain.toFixed(2)+")"} v={p.noirGain} set={x=>p.onNoirGain(Number(x.toFixed(2)))} min={0.8} max={1.2} step={0.01}/>
              <L label={"Lift ("+p.noirLift.toFixed(3)+")"} v={p.noirLift} set={x=>p.onNoirLift(Number(x.toFixed(3)))} min={0} max={0.2} step={0.001}/>
            </div>
          </section>
        )}

        {/* Cinematic */}
        {p.style==="cinematic" && (
          <section className="space-y-3">
            <h3 className="font-semibold">Cinematic</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <L label="Tone Mix" v={p.toneMix} set={p.onToneMix}/>
              <L label="Bloom" v={p.cinBloom} set={p.onCinBloom}/>
              <L label="Contrast" v={p.contrast} set={p.onContrast}/>
              <L label={"Saturation ("+p.saturation.toFixed(2)+")"} v={p.saturation} set={x=>p.onSaturation(Number(x.toFixed(2)))} min={0.8} max={1.2} step={0.01}/>
            </div>
          </section>
        )}

      </CardContent>
    </Card>
  );
}

function L({label,v,set,min=0,max=1,step=0.01}:{label:string;v:number;set:(x:number)=>void;min?:number;max?:number;step?:number}) {
  return (
    <div>
      <Label>{label} — {Math.round((v-min)/(max-min)*100)}%</Label>
      <Slider value={[v]} min={min} max={max} step={step} onValueChange={val=>set(val[0])}/>
    </div>
  );
}

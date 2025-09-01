import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title: string;
  subtitle?: string;
  id?: string;
}>;

export default function SectionCard({ title, subtitle, children, id }: Props) {
  return (
    <section id={id} className="rounded-2xl border bg-white/80 backdrop-blur p-4 shadow-sm space-y-3">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      <div>{children}</div>
    </section>
  );
}

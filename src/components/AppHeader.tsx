// src/components/AppHeader.tsx
import "@/styles/pro.css";

export default function AppHeader() {
  return (
    <header className="pro-header">
      <div className="pro-shell flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-400 to-purple-500" />
          <div className="text-lg font-semibold tracking-tight">Artify Canvas</div>
          <span className="ml-3 text-xs opacity-70">Pro stylization suite</span>
        </div>
        <div className="flex items-center gap-2">
          <a href="https://example.com" target="_blank" className="btn-ghost px-3 py-1.5 rounded-md text-sm">Docs</a>
          <a href="https://example.com" target="_blank" className="btn-ghost px-3 py-1.5 rounded-md text-sm">Support</a>
        </div>
      </div>
    </header>
  );
}

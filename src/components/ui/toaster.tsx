import { Toaster as SonnerToaster } from "sonner";

export default function Toaster() {
  return (
    <SonnerToaster
      richColors
      position="top-center"
      expand
      closeButton
      duration={3500}
    />
  );
}

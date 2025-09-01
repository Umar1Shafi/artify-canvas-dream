// src/hooks/use-stylize.ts
import { useMutation } from "@tanstack/react-query";
import { stylize, type StylizeRequest, type StylizeResponse } from "@/lib/api";

// Mutations are the right tool for POST side-effects (server actions).  :contentReference[oaicite:8]{index=8}
export function useStylize() {
  return useMutation<StylizeResponse, Error, StylizeRequest>({
    mutationKey: ["stylize"],
    mutationFn: (payload) => stylize(payload),
  });
}

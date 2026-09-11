"use client";

import { useEffect, useEffectEvent, type RefObject } from "react";

const openDialogs: RefObject<HTMLElement | null>[] = [];

export function useDialogFocus(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  const close = useEffectEvent(onClose);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    if (!dialog) return;
    openDialogs.push(ref);
    dialog?.querySelector<HTMLElement>("button")?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      const dialog = ref.current;
      if (openDialogs.at(-1) !== ref || !dialog) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close();
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const label = event.key === "ArrowLeft" ? "Imagen anterior" : "Imagen siguiente";
        dialog?.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)?.click();
      }
      if (event.key !== "Tab" || !dialog) return;
      const controls = [...dialog.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input, textarea, [tabindex="0"]')]
        .filter(element => element.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first) return;
      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      const wasTopmost = openDialogs.at(-1) === ref;
      const index = openDialogs.indexOf(ref);
      if (index !== -1) openDialogs.splice(index, 1);
      if (wasTopmost && previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [open, ref]);
}

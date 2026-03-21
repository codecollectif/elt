import { useEffect } from "react";

export function useKeyboard(
  listener: (event: KeyboardEvent) => void,
  dependencies: unknown[] = [],
) {
  useEffect(() => {
    // Wrap to prevent default scrolling using space or arrows,
    // if that becomes an issue we can `event.preventDefault()` here
    // based on specific keys.
    const handleKeydown = (event: KeyboardEvent) => {
      listener(event);
    };

    window.addEventListener("keydown", handleKeydown);
    window.focus(); // Ensure the window catches the events

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [...dependencies, listener]);
}

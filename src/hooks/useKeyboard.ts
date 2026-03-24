import { type DependencyList, useEffect } from "react";

export function useKeyboard(
  listener: (event: KeyboardEvent) => void,
  dependencies: DependencyList = [],
  autoFocus = true,
) {
  useEffect(() => {
    window.addEventListener("keydown", listener);
    if (autoFocus) {
      window.focus();
    }

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [...dependencies, listener, autoFocus]);
}

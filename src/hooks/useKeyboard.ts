import { type DependencyList, useEffect } from "react";

export function useKeyboard(
  listener: (event: KeyboardEvent) => void,
  dependencies: DependencyList = [],
) {
  useEffect(() => {
    window.addEventListener("keydown", listener);
    window.focus();

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [...dependencies, listener]);
}

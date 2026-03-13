import { useState } from "react";

function setItem(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getItem<T>(key: string): T | null {
  const data = window.localStorage.getItem(key);

  if (data != null) {
    return JSON.parse(data) as T;
  }

  return data;
}

function removeItem(key: string) {
  window.localStorage.removeItem(key);
}

type Jsonable = null | undefined | boolean | string | number | object;

type DispatchAction<T extends Jsonable> = T | ((prevState: T) => T);

export default function useLocalStorage<T extends Jsonable>(
  key: string,
  initialValue: T,
) {
  const [value, setValue] = useState<T>(() => {
    const data = getItem<T>(key);

    return data ?? initialValue;
  });

  function handleDispatch(action: DispatchAction<T>) {
    if (typeof action === "function") {
      setValue((prevState) => {
        const newValue = action(prevState);

        setItem(key, newValue);

        return newValue;
      });
    } else {
      setValue(action);
      setItem(key, action);
    }
  }

  function clearState() {
    setValue(undefined as T);
    removeItem(key);
  }

  return [value, handleDispatch, clearState] as const;
}

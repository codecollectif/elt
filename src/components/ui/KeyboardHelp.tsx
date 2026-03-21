import React, { type ReactNode } from "react";

export interface Shortcut {
  keys?: string[];
  keyNode?: ReactNode;
  description: string;
  color?: string;
}

interface Props {
  shortcuts: Shortcut[];
}

export function KeyboardHelp({ shortcuts }: Props) {
  return (
    <dl style={{ position: "absolute", top: 0, right: 0, opacity: 0.8 }}>
      {shortcuts.map((shortcut) => (
        <React.Fragment key={shortcut.description}>
          <dt>
            {shortcut.keyNode
              ? shortcut.keyNode
              : shortcut.keys?.map((key, i) => (
                  <React.Fragment key={key}>
                    {i > 0 && " + "}
                    <kbd>{key}</kbd>
                  </React.Fragment>
                ))}
          </dt>
          <dd style={{ color: shortcut.color }}>{shortcut.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

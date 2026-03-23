import React from "react";

interface Props {
  text: string;
}

/**
 * Renders a block of text with paragraph (\n\n) and line break (\n) support.
 */
export function TextBlock({ text }: Props) {
  return (
    <>
      {text.split("\n\n").map((p, pIndex) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: statique
        <p key={`p-${pIndex}`}>
          {p.split("\n").map((line, lIndex) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: statique
            <React.Fragment key={`l-${lIndex}`}>
              {lIndex !== 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </p>
      ))}
    </>
  );
}

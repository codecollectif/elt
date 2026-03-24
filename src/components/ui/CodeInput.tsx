import * as codeInput from "@webcoder49/code-input";
import IndentPlugin from "@webcoder49/code-input/plugins/indent.mjs";
import PrismTemplate from "@webcoder49/code-input/templates/prism.mjs";
import Prism from "prismjs";
import type React from "react";
import { forwardRef, useEffect } from "react";
import "prismjs/components/prism-javascript";
import "@webcoder49/code-input/code-input.css";
import "prismjs/themes/prism.css";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "code-input": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLTextAreaElement> & {
          language: string;
          value?: string;
          template?: string;
        },
        HTMLTextAreaElement
      >;
    }
  }
}

// Register the template globally once
let isRegistered = false;
function ensureRegistration() {
  if (isRegistered) return;
  codeInput.registerTemplate(
    "syntax-highlighted",
    new PrismTemplate(Prism, [new IndentPlugin()]),
  );
  isRegistered = true;
}

interface CodeInputProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  language: string;
  value?: string;
  template?: string;
}

/**
 * A React wrapper for the <code-input> custom element.
 * Handles global registration of the Prism template and necessary styles.
 */
export const CodeInput = forwardRef<HTMLTextAreaElement, CodeInputProps>(
  ({ language, value, template = "syntax-highlighted", ...props }, ref) => {
    useEffect(() => {
      ensureRegistration();
    }, []);

    // React 19 supports custom elements directly with props and refs
    return (
      <code-input
        ref={ref}
        language={language}
        value={value}
        template={template}
        {...props}
      />
    );
  },
);

CodeInput.displayName = "CodeInput";

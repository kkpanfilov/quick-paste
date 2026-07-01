import { useEffect } from "react";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";

import { languageLoaders } from "@/shared/lib/syntax-highlighter/language-loaders.js";
import type { Language } from "@/shared/lists/language.map.ts";

export type HighlightState = {
  isLoaded: boolean;
  language: null | Language;
};

type Props = {
  language: Language;
  setHighlightState: React.Dispatch<React.SetStateAction<HighlightState>>;
};

export function useLoadLanguage({ language, setHighlightState }: Props) {
  useEffect(() => {
    let isActive = true;

    async function loadLanguage(language: Language) {
      if (language === "plain") {
        if (isActive) {
          setHighlightState({
            isLoaded: true,
            language: "plain",
          });
        }

        return;
      }

      const loader = languageLoaders[language];

      if (!loader) {
        if (isActive) {
          setHighlightState({
            isLoaded: true,
            language: "plain",
          });
        }

        return;
      }

      try {
        const module = await loader();

        if (!isActive) return;

        SyntaxHighlighter.registerLanguage(language, module.default);

        setHighlightState({
          isLoaded: true,
          language,
        });
      } catch (error) {
        console.error(`Failed to load language: ${language}`, error);

        if (isActive) {
          setHighlightState({
            isLoaded: true,
            language: "plain",
          });
        }
      }
    }

    loadLanguage(language);

    return () => {
      isActive = false;
    };
  }, [language, setHighlightState]);
}

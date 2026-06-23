import { useEffect } from "react";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";

import { languageLoaders } from "@/shared/lib/syntax-highlighter/language-loaders.js";

export function useLoadLanguage({ language, setHighlightState }) {
  useEffect(() => {
    let isActive = true;

    async function loadLanguage(language) {
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

import { useEffect } from "react";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";

import { languageLoaders } from "@/shared/lib/syntax-highlighter/language-loaders.js";

export function useLoadLanguages({
  languages,
  registeredLanguagesRef,
  setIsHighlightReady,
}) {
  useEffect(() => {
    let isActive = true;

    async function loadLanguages() {
      if (!languages.length) {
        if (isActive) {
          setIsHighlightReady(true);
        }

        return;
      }

      try {
        for (const language of languages) {
          if (registeredLanguagesRef.current.has(language)) continue;

          const loader = languageLoaders[language];

          if (!loader) continue;

          registeredLanguagesRef.current.add(language);

          try {
            const module = await loader();
            SyntaxHighlighter.registerLanguage(language, module.default);
          } catch (error) {
            registeredLanguagesRef.current.delete(language);
            console.error(`Failed to load language: ${language}`, error);
          }
        }
      } finally {
        if (isActive) setIsHighlightReady(true);
      }
    }

    loadLanguages();

    return () => {
      isActive = false;
    };
  }, [languages, setIsHighlightReady, registeredLanguagesRef]);
}

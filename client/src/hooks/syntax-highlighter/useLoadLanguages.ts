import { useEffect } from "react";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";

import { languageLoaders } from "@/shared/lib/syntax-highlighter/language-loaders.js";
import type { Language } from "@/shared/lists/language.map.ts";

type Props = {
  languages: Language[];
  registeredLanguagesRef: React.RefObject<Set<string>>;
  setIsHighlightReady: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useLoadLanguages({
  languages,
  registeredLanguagesRef,
  setIsHighlightReady,
}: Props) {
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
          if (language === "plain") continue;

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

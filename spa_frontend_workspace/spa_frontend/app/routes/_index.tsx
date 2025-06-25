import { useRef, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Text formatting and conversion single-page utility app.
 */
export default function Index() {
  // States for text area input, transformation type
  const [text, setText] = useState("");
  const [activeTransform, setActiveTransform] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Utilities
  function toUpper(t: string) {
    return t.toUpperCase();
  }
  function toLower(t: string) {
    return t.toLowerCase();
  }
  function toTitle(t: string) {
    return t.replace(
      /\w\S*/g,
      (word: string) =>
        word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    );
  }
  function toSentence(t: string) {
    // Make first letter after sentence-ending punctuation upper
    return t.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  }
  function removeExtraSpaces(t: string) {
    return t.replace(/\s+/g, " ").trim();
  }

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setActiveTransform(null);
    setHasCopied(false);
    autoResize(e.target);
  };

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  const handleTransform = (type: string) => {
    if (!text.trim()) return;
    let newText = text;
    switch (type) {
      case "UPPERCASE":
        newText = toUpper(text);
        break;
      case "lowercase":
        newText = toLower(text);
        break;
      case "Title Case":
        newText = toTitle(text);
        break;
      case "Sentence case":
        newText = toSentence(text);
        break;
      default:
        break;
    }
    setText(newText);
    setActiveTransform(type);
    setHasCopied(false);
    if (textareaRef.current) autoResize(textareaRef.current);
  };

  const handleRemoveSpaces = () => {
    if (!text.trim()) return;
    setText(removeExtraSpaces(text));
    setActiveTransform("Remove Spaces");
    setHasCopied(false);
    if (textareaRef.current) autoResize(textareaRef.current);
  };

  const handleCopy = async () => {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
    } catch {
      setHasCopied(false);
    }
  };

  // Real-time stats
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  // Responsiveness: toggle theme
  const handleToggleTheme = () => {
    setDarkMode((d) => !d);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  // Button definitions
  const buttons = [
    { label: "UPPERCASE", type: "UPPERCASE" },
    { label: "lowercase", type: "lowercase" },
    { label: "Title Case", type: "Title Case" },
    { label: "Sentence case", type: "Sentence case" },
  ];

  return (
    <main className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-950" : "bg-white"} transition-colors`}>
      <div className="w-full max-w-xl mx-auto flex flex-col gap-6 p-4 sm:p-8 rounded-lg shadow-lg bg-white dark:bg-gray-900">
        <header className="mb-2 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">Text Format Converter</h1>
          <button
            aria-label="Toggle light/dark mode"
            type="button"
            onClick={handleToggleTheme}
            className="inline-flex items-center px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-100 transition"
          >
            {darkMode ? (
              <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m8.485-8.485h1M3.515 12.515h1M16.95 7.05l.707-.707M6.343 17.657l.707-.707M16.95 16.95l.707.707M6.343 6.343l.707.707M12 5a7 7 0 000 14 7 7 0 000-14z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            ) : (
              <svg className="w-5 h-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 0111.21 3a7 7 0 108.56 8.56c-.16.14-.33.27-.51.39z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            )}
          </button>
        </header>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInputChange}
          rows={3}
          placeholder="Type or paste your text here..."
          className="w-full resize-none border border-gray-300 dark:border-gray-700 rounded-md p-3 text-base font-sans bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          aria-label="Text input area"
          spellCheck={true}
        />
        <div className="flex flex-wrap justify-center gap-3 mb-1">
          {buttons.map((b) => (
            <button
              key={b.type}
              type="button"
              className={`px-3 py-2 rounded font-medium text-sm transition border border-gray-200 dark:border-gray-700
                ${activeTransform === b.type
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-700"}
                ${!text.trim() ? "opacity-60 cursor-not-allowed" : "hover:border-blue-500"}
              `}
              disabled={!text.trim()}
              aria-pressed={activeTransform === b.type}
              onClick={() => handleTransform(b.type)}
            >
              {b.label}
            </button>
          ))}
          <button
            type="button"
            className={`px-3 py-2 rounded border font-medium text-sm bg-accent hover:bg-accent/80 text-cyan-700 dark:text-cyan-400 border-gray-200 dark:border-gray-700 transition
              ${activeTransform === "Remove Spaces" ? "ring-2 ring-cyan-400" : ""}
              ${!text.trim() ? "opacity-60 cursor-not-allowed" : ""}
            `}
            disabled={!text.trim()}
            onClick={handleRemoveSpaces}
          >
            Remove Extra Spaces
          </button>
          <button
            type="button"
            className={`px-3 py-2 rounded border font-medium text-sm border-gray-200 dark:border-gray-700 
              bg-primary hover:bg-primary/90 text-white
              ${!text.trim() ? "opacity-60 cursor-not-allowed" : ""}
            `}
            style={{ backgroundColor: "#2563EB" }} // primary color
            disabled={!text.trim()}
            onClick={handleCopy}
            aria-live="polite"
          >
            {hasCopied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 gap-2">
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{charCount} characters</span>
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{wordCount} word{wordCount !== 1 ? "s" : ""}</span>
        </div>
        <footer className="pt-6 text-xs text-gray-400 dark:text-gray-600 text-center select-none">
          &copy; {new Date().getFullYear()} Text Format Converter &bull; Built with Remix + Tailwind CSS
        </footer>
      </div>
    </main>
  );
}

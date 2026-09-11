import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  // Simple, robust parser for markdown elements in chat responses
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];

    let inList = false;
    let listItems: string[] = [];

    const flushList = () => {
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="my-2 space-y-1 list-disc list-inside">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {parseInlineFormatting(item)}
              </li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Heading 3 or 4
      if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h4 key={`h3-${index}`} className="text-sm font-bold text-slate-900 mt-3 mb-1">
            {parseInlineFormatting(trimmed.substring(4))}
          </h4>
        );
      } else if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h3 key={`h2-${index}`} className="text-base font-bold text-slate-900 mt-3 mb-1">
            {parseInlineFormatting(trimmed.substring(3))}
          </h3>
        );
      } else if (trimmed.startsWith('# ')) {
        flushList();
        elements.push(
          <h2 key={`h1-${index}`} className="text-base font-bold text-slate-900 mt-3 mb-1.5">
            {parseInlineFormatting(trimmed.substring(2))}
          </h2>
        );
      }
      // Bullet list item
      else if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
        inList = true;
        listItems.push(trimmed.substring(2));
      }
      // Numbered list item
      else if (/^\d+\.\s/.test(trimmed)) {
        flushList();
        const match = trimmed.match(/^(\d+\.)\s(.*)/);
        if (match) {
          elements.push(
            <div key={`num-${index}`} className="flex items-start space-x-2 my-1">
              <span className="font-bold text-emerald-700 shrink-0">{match[1]}</span>
              <span className="leading-relaxed">{parseInlineFormatting(match[2])}</span>
            </div>
          );
        }
      }
      // Empty line / spacer
      else if (trimmed === '') {
        flushList();
        elements.push(<div key={`space-${index}`} className="h-2" />);
      }
      // Standard paragraph
      else {
        flushList();
        elements.push(
          <p key={`p-${index}`} className="leading-relaxed my-1">
            {parseInlineFormatting(line)}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  const parseInlineFormatting = (text: string): React.ReactNode[] => {
    // Parse bold (**text**), code (`code`), italic (*text*)
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const matchText = match[0];
      if (matchText.startsWith('**') && matchText.endsWith('**')) {
        parts.push(
          <strong key={`bold-${match.index}`} className="font-bold text-slate-900">
            {matchText.slice(2, -2)}
          </strong>
        );
      } else if (matchText.startsWith('`') && matchText.endsWith('`')) {
        parts.push(
          <code
            key={`code-${match.index}`}
            className="px-1.5 py-0.5 rounded bg-slate-200/80 text-emerald-800 text-[11px] font-mono"
          >
            {matchText.slice(1, -1)}
          </code>
        );
      } else if (matchText.startsWith('*') && matchText.endsWith('*')) {
        parts.push(
          <em key={`italic-${match.index}`} className="italic">
            {matchText.slice(1, -1)}
          </em>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  return <div className={`prose-sm ${className}`}>{renderFormattedText(content)}</div>;
};

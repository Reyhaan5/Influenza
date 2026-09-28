import React, { useRef } from "react";
import {
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, Link2,
} from "lucide-react";

const FORMAT_MAP = {
  bold: (s) => `**${s || "bold text"}**`,
  italic: (s) => `*${s || "italic text"}*`,
  underline: (s) => `<u>${s || "underlined text"}</u>`,
  strike: (s) => `~~${s || "struck text"}~~`,
  bullet: (s) => `\n• ${s || "item"}`,
  numbered: (s) => `\n1. ${s || "item"}`,
  link: (s) => `[${s || "link text"}](https://)`,
};

const TOOLBAR_GROUPS = [
  [
    { type: "left", title: "Align Left", icon: AlignLeft },
    { type: "center", title: "Align Center", icon: AlignCenter },
    { type: "right", title: "Align Right", icon: AlignRight },
  ],
  [
    { type: "bold", title: "Bold", icon: Bold, cls: "font-bold" },
    { type: "italic", title: "Italic", icon: Italic, cls: "italic" },
    { type: "underline", title: "Underline", icon: Underline, cls: "underline" },
    { type: "strike", title: "Strikethrough", icon: Strikethrough, cls: "line-through" },
  ],
  [
    { type: "bullet", title: "Bullet List", icon: List },
    { type: "numbered", title: "Numbered List", icon: ListOrdered },
    { type: "link", title: "Insert Link", icon: Link2 },
  ],
];

export default function RichTextarea({
  value = "",
  onChange,
  maxLength = 500,
  rows = 3,
  placeholder = "Add description...",
  ringColor = "focus-within:ring-fuchsia-500",
  className = "",
}) {
  const textareaRef = useRef(null);

  const handleFormatText = (type) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const formatter = FORMAT_MAP[type];
    const formatted = formatter ? formatter(selected) : selected;
    const newText = value.substring(0, start) + formatted + value.substring(end);
    if (maxLength && newText.length > maxLength) return;
    onChange(newText);
  };

  return (
    <div className={`border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-2 ${ringColor} transition ${className}`}>
      <div className="p-3 relative">
        <textarea
          ref={textareaRef}
          rows={rows}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full text-sm bg-transparent text-gray-900 focus:outline-none resize-none"
        />
        {maxLength && <div className="text-right text-[11px] text-gray-400 mt-1">{value.length}/{maxLength}</div>}
      </div>

      <div className="bg-gray-50 border-t border-gray-200 px-3 py-2 flex items-center gap-1.5 text-gray-600 overflow-x-auto">
        {TOOLBAR_GROUPS.map((group, gIdx) => (
          <React.Fragment key={gIdx}>
            {gIdx > 0 && <div className="h-4 w-[1px] bg-gray-300 mx-1" />}
            {group.map((btn) => {
              const Icon = btn.icon;
              return (
                <button
                  key={btn.type}
                  type="button"
                  onClick={() => handleFormatText(btn.type)}
                  className={`p-1 rounded hover:bg-gray-200 text-gray-600 transition cursor-pointer ${btn.cls || ""}`}
                  title={btn.title}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

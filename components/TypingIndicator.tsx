"use client";
export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-1">
      <div className="w-8 h-8 flex-shrink-0" /> {/* espacio del avatar */}
      <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
        <span className="typing-dot" style={{ animationDelay: "0ms" }} />
        <span className="typing-dot" style={{ animationDelay: "160ms" }} />
        <span className="typing-dot" style={{ animationDelay: "320ms" }} />
      </div>
    </div>
  );
}

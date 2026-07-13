"use client";
import EspiAvatar from "./EspiAvatar";
import type { ChatMessage } from "@/lib/chatReducer";

interface Props {
  message: ChatMessage;
  showAvatar?: boolean;
}

function Ticks({ ticks }: { ticks: ChatMessage["ticks"] }) {
  if (ticks === "sent") {
    return <span className="text-[10px] text-white/70 ml-1">✓</span>;
  }
  if (ticks === "delivered") {
    return <span className="text-[10px] text-white/70 ml-1">✓✓</span>;
  }
  return <span className="text-[10px] text-[#53BDEB] ml-1">✓✓</span>;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export default function MessageBubble({ message, showAvatar = true }: Props) {
  const isBot = message.actor === "bot";

  const bubbleContent = message.content.split("\n").map((line, i) => (
    <span key={i}>
      {line}
      {i < message.content.split("\n").length - 1 && <br />}
    </span>
  ));

  if (isBot) {
    return (
      <div className="flex items-end gap-2 mb-1 animate-fadeIn">
        <div className="w-8 flex-shrink-0 flex items-end">
          {showAvatar && <EspiAvatar size={28} />}
        </div>
        <div className="max-w-[75%]">
          <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm relative">
            <p className="text-[14px] text-[#1C1F2A] leading-relaxed whitespace-pre-line">
              {bubbleContent}
            </p>
            <span className="text-[10px] text-[#9898A2] block text-right mt-1">
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // User bubble
  return (
    <div className="flex justify-end mb-1 animate-fadeIn">
      <div className="max-w-[75%]">
        <div className="bg-[#DCF8C6] rounded-2xl rounded-br-sm px-4 py-2.5 shadow-sm relative">
          <p className="text-[14px] text-[#1C1F2A] leading-relaxed whitespace-pre-line">
            {bubbleContent}
          </p>
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-[10px] text-[#9898A2]">{formatTime(message.timestamp)}</span>
            <Ticks ticks={message.ticks} />
          </div>
        </div>
      </div>
    </div>
  );
}

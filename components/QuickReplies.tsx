"use client";
interface QuickReply {
  id: string;
  label: string;
}

interface Props {
  options: QuickReply[];
  onSelect: (id: string, label: string) => void;
  disabled?: boolean;
}

export default function QuickReplies({ options, onSelect, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-2 justify-end mt-2 mb-2 px-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id, opt.label)}
          disabled={disabled}
          className="
            px-4 py-2 rounded-full border-2 border-[#FFAA00] bg-white
            text-[13px] font-semibold text-[#424552]
            hover:bg-[#FFAA00] hover:text-[#1C1F2A]
            transition-all duration-150
            disabled:opacity-50 disabled:pointer-events-none
            focus:outline-none focus:ring-2 focus:ring-[#FFAA00]/40
            min-h-[44px]
          "
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

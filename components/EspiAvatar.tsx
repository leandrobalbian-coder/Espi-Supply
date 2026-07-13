"use client";
import { AGENT_AVATAR } from "@/lib/persona";

interface Props {
  size?: number;
}

export default function EspiAvatar({ size = 40 }: Props) {
  if (AGENT_AVATAR.avatarUrl) {
    return (
      <img
        src={AGENT_AVATAR.avatarUrl}
        alt="Espi avatar"
        width={size}
        height={size}
        style={{ borderRadius: "9999px", objectFit: "cover" }}
      />
    );
  }

  const fontSize = Math.round(size * 0.42);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Avatar de Espi"
      role="img"
    >
      {/* Fondo gradiente warm-amber de Spot2 */}
      <defs>
        <radialGradient id="espi-grad" cx="38%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#FFC857" />
          <stop offset="100%" stopColor="#E69900" />
        </radialGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={size / 2} fill="url(#espi-grad)" />
      {/* Cara simple amigable */}
      <text
        x={size / 2}
        y={size / 2 + fontSize * 0.36}
        textAnchor="middle"
        fontSize={fontSize}
        fontFamily="Montserrat, sans-serif"
        fontWeight="700"
        fill="#1C1F2A"
      >
        {AGENT_AVATAR.initial}
      </text>
    </svg>
  );
}

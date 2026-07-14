/**
 * Máquina de estados del chat.
 * Todo el estado de la conversación vive aquí.
 */

import type { Variant, UserProfile, Step } from "./flows";

export interface ChatMessage {
  id: string;
  actor: "bot" | "user";
  type: "text" | "quickReply" | "userInput" | "form" | "typing" | "cta" | "welcome" | "platformRedirect" | "success";
  content: string;
  options?: { id: string; label: string }[];
  fields?: { id: string; label: string; type: string; placeholder: string }[];
  timestamp: Date;
  ticks: "sent" | "delivered" | "read";
}

export interface ChatState {
  messages: ChatMessage[];
  phase:
    | "opening"
    | "whatis"
    | "bye"
    | "flow"
    | "ask_profile"
    | "success"
    | "welcome"
    | "done";
  stepIndex: number;
  context: {
    name: string;
    email: string;
    profile: UserProfile | null;
  };
  isTyping: boolean;
  awaitingInput: boolean;
  currentInputTarget: "name" | "email" | null;
  inputValue: string;
  correctionMode: "name" | "email" | null;
}

export const initialState: ChatState = {
  messages: [],
  phase: "opening",
  stepIndex: 0,
  context: { name: "", email: "", profile: null },
  isTyping: false,
  awaitingInput: false,
  currentInputTarget: null,
  inputValue: "",
  correctionMode: null,
};

export type ChatAction =
  | { type: "ADD_MESSAGE"; message: ChatMessage }
  | { type: "SET_TYPING"; value: boolean }
  | { type: "SET_AWAITING_INPUT"; target: "name" | "email" | null }
  | { type: "SET_INPUT_VALUE"; value: string }
  | { type: "SET_PHASE"; phase: ChatState["phase"] }
  | { type: "SET_STEP_INDEX"; index: number }
  | { type: "SET_CONTEXT"; context: Partial<ChatState["context"]> }
  | { type: "SET_CORRECTION_MODE"; mode: "name" | "email" | null }
  | { type: "RESET" };

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.message] };
    case "SET_TYPING":
      return { ...state, isTyping: action.value };
    case "SET_AWAITING_INPUT":
      return { ...state, awaitingInput: action.target !== null, currentInputTarget: action.target };
    case "SET_INPUT_VALUE":
      return { ...state, inputValue: action.value };
    case "SET_PHASE":
      return { ...state, phase: action.phase };
    case "SET_STEP_INDEX":
      return { ...state, stepIndex: action.index };
    case "SET_CONTEXT":
      return { ...state, context: { ...state.context, ...action.context } };
    case "SET_CORRECTION_MODE":
      return { ...state, correctionMode: action.mode };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

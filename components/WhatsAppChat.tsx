"use client";
import { useEffect, useRef, useReducer, useCallback } from "react";
import { chatReducer, initialState, type ChatMessage } from "@/lib/chatReducer";
import { AGENT_FULL_TITLE } from "@/lib/persona";
import { WELCOME_MESSAGES, WELCOME_CTAS, UI_HINTS, type UserProfile } from "@/lib/content";
import { isValidEmail } from "@/lib/validation";
import {
  OPENING_STEPS,
  WHATIS_BRANCH_STEPS,
  LATER_STEP,
  VARIANT_A_STEPS,
  VARIANT_B_STEPS,
  VARIANT_C_STEPS,
  ASK_PROFILE_STEP,
  SUCCESS_STEP,
  A_RECONFIRM_STEP,
  ASK_EMAIL_CORRECTION_STEP,
  ASK_NAME_CORRECTION_STEP,
  type Variant,
  type Step,
  type ConversationContext,
} from "@/lib/flows";
import EspiAvatar from "./EspiAvatar";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import QuickReplies from "./QuickReplies";
import WhatsAppForm from "./WhatsAppForm";
import PlatformRedirectCard from "./PlatformRedirectCard";

interface Props {
  variant: Variant;
}

let msgIdCounter = 0;
function newId() { return `msg-${++msgIdCounter}`; }

function resolveContent(step: Step, ctx: ConversationContext): string {
  return typeof step.content === "function" ? step.content(ctx) : step.content;
}

export default function WhatsAppChat({ variant }: Props) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const answeredMessages = useRef<Set<string>>(new Set());
  const platformRedirectAnswered = useRef(false);

  // ─── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages, state.isTyping]);

  // ─── Reset on variant change (key prop forces full remount, but this guards state) ──
  useEffect(() => {
    answeredMessages.current.clear();
    platformRedirectAnswered.current = false;
    dispatch({ type: "RESET" });
    msgIdCounter = 0;
  }, [variant]);

  // ─── Bot message emitter ─────────────────────────────────────────────────────
  const emitBotMessage = useCallback(
    (step: Step, ctx: ConversationContext, onDone?: () => void) => {
      dispatch({ type: "SET_TYPING", value: true });
      const delay = step.delay ?? 800;
      setTimeout(() => {
        dispatch({ type: "SET_TYPING", value: false });
        const msg: ChatMessage = {
          id: newId(),
          actor: "bot",
          type: step.type as ChatMessage["type"],
          content: resolveContent(step, ctx),
          options: step.options,
          fields: step.fields,
          timestamp: new Date(),
          ticks: "read",
        };
        dispatch({ type: "ADD_MESSAGE", message: msg });
        onDone?.();
      }, delay);
    },
    []
  );

  const emitBotError = useCallback((text: string) => {
    dispatch({ type: "SET_TYPING", value: true });
    setTimeout(() => {
      dispatch({ type: "SET_TYPING", value: false });
      dispatch({
        type: "ADD_MESSAGE",
        message: {
          id: newId(),
          actor: "bot",
          type: "text",
          content: text,
          timestamp: new Date(),
          ticks: "read",
        },
      });
    }, 600);
  }, []);

  const emitUserMessage = useCallback((content: string) => {
    dispatch({
      type: "ADD_MESSAGE",
      message: {
        id: newId(),
        actor: "user",
        type: "text",
        content,
        timestamp: new Date(),
        ticks: "read",
      },
    });
  }, []);

  // ─── Flow orchestrator ───────────────────────────────────────────────────────
  const runVariantFlow = useCallback(
    (ctx: ConversationContext) => {
      const steps =
        variant === "A" ? VARIANT_A_STEPS : variant === "B" ? VARIANT_B_STEPS : VARIANT_C_STEPS;

      let stepIdx = 0;

      function runStep(currentCtx: ConversationContext) {
        if (stepIdx >= steps.length) {
          emitBotMessage(ASK_PROFILE_STEP, currentCtx);
          dispatch({ type: "SET_PHASE", phase: "ask_profile" });
          dispatch({ type: "SET_CONTEXT", context: currentCtx });
          return;
        }
        const step = steps[stepIdx];

        if (step.type === "userInput") {
          emitBotMessage(step, currentCtx, () => {
            const target = stepIdx === 0 ? "name" : "email";
            dispatch({ type: "SET_AWAITING_INPUT", target });
            dispatch({ type: "SET_PHASE", phase: "flow" });
            dispatch({ type: "SET_STEP_INDEX", index: stepIdx });
            dispatch({ type: "SET_CONTEXT", context: currentCtx });
          });
          return;
        }

        if (step.type === "form") {
          emitBotMessage(step, currentCtx);
          dispatch({ type: "SET_PHASE", phase: "flow" });
          dispatch({ type: "SET_STEP_INDEX", index: stepIdx });
          dispatch({ type: "SET_CONTEXT", context: currentCtx });
          return;
        }

        if (step.type === "platformRedirect") {
          emitBotMessage(step, currentCtx);
          dispatch({ type: "SET_PHASE", phase: "flow" });
          dispatch({ type: "SET_STEP_INDEX", index: stepIdx });
          dispatch({ type: "SET_CONTEXT", context: currentCtx });
          return;
        }

        if (step.type === "quickReply" && step.id === "a_confirm") {
          emitBotMessage(step, currentCtx);
          dispatch({ type: "SET_PHASE", phase: "flow" });
          dispatch({ type: "SET_STEP_INDEX", index: stepIdx });
          dispatch({ type: "SET_CONTEXT", context: currentCtx });
          return;
        }

        emitBotMessage(step, currentCtx, () => {
          stepIdx++;
          runStep(currentCtx);
        });
      }

      runStep(ctx);
    },
    [variant, emitBotMessage]
  );

  const runSuccess = useCallback(
    (ctx: ConversationContext) => {
      const profile = ctx.profile ?? "propietario";
      emitBotMessage(SUCCESS_STEP, ctx, () => {
        const welcomeMsg: ChatMessage = {
          id: newId(),
          actor: "bot",
          type: "welcome",
          content: WELCOME_MESSAGES[profile as UserProfile],
          options: WELCOME_CTAS[profile as UserProfile].map((c) => ({ id: c.url, label: c.label })),
          timestamp: new Date(),
          ticks: "read",
        };
        setTimeout(() => {
          dispatch({ type: "ADD_MESSAGE", message: welcomeMsg });
          dispatch({ type: "SET_PHASE", phase: "done" });
        }, 1000);
      });
      dispatch({ type: "SET_PHASE", phase: "success" });
    },
    [emitBotMessage]
  );

  // ─── Start conversation on mount ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function safeTimeout(fn: () => void, ms: number) {
      const id = setTimeout(() => { if (!cancelled) fn(); }, ms);
      timers.push(id);
    }

    function cancelAll() {
      cancelled = true;
      timers.forEach(clearTimeout);
      dispatch({ type: "RESET" });
      answeredMessages.current.clear();
      platformRedirectAnswered.current = false;
      msgIdCounter = 0;
    }

    let i = 0;
    const ctx = { name: "", email: "", profile: null };

    function runOpening() {
      if (cancelled || i >= OPENING_STEPS.length) return;
      const step = OPENING_STEPS[i];
      dispatch({ type: "SET_TYPING", value: true });
      safeTimeout(() => {
        if (cancelled) return;
        dispatch({ type: "SET_TYPING", value: false });
        dispatch({
          type: "ADD_MESSAGE",
          message: {
            id: `msg-${++msgIdCounter}`,
            actor: "bot" as const,
            type: step.type as ChatMessage["type"],
            content: typeof step.content === "function" ? step.content(ctx) : step.content,
            options: step.options,
            timestamp: new Date(),
            ticks: "read" as const,
          },
        });
        if (step.requiresInput) {
          dispatch({ type: "SET_PHASE", phase: "opening" });
        } else {
          i++;
          runOpening();
        }
      }, step.delay ?? 800);
    }

    safeTimeout(runOpening, 400);
    return cancelAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  // ─── Quick reply handler ──────────────────────────────────────────────────────
  function handleQuickReply(msgId: string, optId: string, optLabel: string) {
    if (answeredMessages.current.has(msgId)) return;
    answeredMessages.current.add(msgId);

    emitUserMessage(optLabel);
    const ctx = state.context;

    if (state.phase === "opening") {
      if (optId === "start") {
        runVariantFlow(ctx);
      } else if (optId === "whatis") {
        dispatch({ type: "SET_PHASE", phase: "whatis" });
        emitBotMessage(WHATIS_BRANCH_STEPS[0], ctx);
      } else if (optId === "later") {
        emitBotMessage(LATER_STEP, ctx);
        dispatch({ type: "SET_PHASE", phase: "bye" });
      }
      return;
    }

    if (state.phase === "whatis") {
      if (optId === "start") {
        runVariantFlow(ctx);
      } else {
        emitBotMessage(LATER_STEP, ctx);
        dispatch({ type: "SET_PHASE", phase: "bye" });
      }
      return;
    }

    if (state.phase === "flow") {
      if (optId === "confirm") {
        // "Sí, crear" — avanzar a crear cuenta
        const creatingStep = VARIANT_A_STEPS.find((s) => s.id === "a_creating");
        if (creatingStep) {
          emitBotMessage(creatingStep, ctx, () => {
            emitBotMessage(ASK_PROFILE_STEP, ctx);
            dispatch({ type: "SET_PHASE", phase: "ask_profile" });
          });
        }
      } else if (optId === "edit_email") {
        // Corrección granular: solo pide el correo, mantiene el nombre
        emitBotMessage(ASK_EMAIL_CORRECTION_STEP, ctx, () => {
          dispatch({ type: "SET_AWAITING_INPUT", target: "email" });
          dispatch({ type: "SET_CORRECTION_MODE", mode: "email" });
        });
      } else if (optId === "edit_name") {
        // Corrección granular: solo pide el nombre, mantiene el correo
        emitBotMessage(ASK_NAME_CORRECTION_STEP, ctx, () => {
          dispatch({ type: "SET_AWAITING_INPUT", target: "name" });
          dispatch({ type: "SET_CORRECTION_MODE", mode: "name" });
        });
      }
      return;
    }

    if (state.phase === "ask_profile") {
      const profile = optId as UserProfile;
      const newCtx = { ...ctx, profile };
      dispatch({ type: "SET_CONTEXT", context: { profile } });
      runSuccess(newCtx);
    }
  }

  // ─── Text input handler ───────────────────────────────────────────────────────
  function handleTextInput() {
    const val = state.inputValue.trim();
    if (!val) return;

    // Validar correo antes de aceptar
    if (state.currentInputTarget === "email" && !isValidEmail(val)) {
      emitUserMessage(val);
      dispatch({ type: "SET_INPUT_VALUE", value: "" });
      emitBotError(
        "Mmm, ese correo no se ve completo. ¿Lo revisas? Debe verse como nombre@dominio.com"
      );
      // Mantenemos awaitingInput: true y currentInputTarget: "email" — no avanzamos
      return;
    }

    emitUserMessage(val);
    dispatch({ type: "SET_INPUT_VALUE", value: "" });

    const target = state.currentInputTarget;
    const newCtx = { ...state.context, [target ?? "name"]: val };
    dispatch({ type: "SET_CONTEXT", context: { [target ?? "name"]: val } });
    dispatch({ type: "SET_AWAITING_INPUT", target: null });

    // Si venimos de una corrección granular → re-confirmar sin reset
    if (state.correctionMode !== null) {
      dispatch({ type: "SET_CORRECTION_MODE", mode: null });
      emitBotMessage(A_RECONFIRM_STEP, newCtx);
      dispatch({ type: "SET_PHASE", phase: "flow" });
      return;
    }

    // Flujo normal — avanzar al siguiente paso
    const steps =
      variant === "A" ? VARIANT_A_STEPS : variant === "B" ? VARIANT_B_STEPS : VARIANT_C_STEPS;
    const nextStepIdx = state.stepIndex + 1;

    if (nextStepIdx < steps.length) {
      const next = steps[nextStepIdx];

      if (next.type === "userInput") {
        emitBotMessage(next, newCtx, () => {
          const nextTarget = nextStepIdx === 0 ? "name" : "email";
          dispatch({ type: "SET_AWAITING_INPUT", target: nextTarget });
          dispatch({ type: "SET_STEP_INDEX", index: nextStepIdx });
        });
      } else if (next.type === "quickReply") {
        emitBotMessage(next, newCtx);
        dispatch({ type: "SET_STEP_INDEX", index: nextStepIdx });
      } else if (next.type === "platformRedirect") {
        // Mostrar card y esperar — no avanzar automáticamente
        emitBotMessage(next, newCtx);
        dispatch({ type: "SET_PHASE", phase: "flow" });
        dispatch({ type: "SET_STEP_INDEX", index: nextStepIdx });
        dispatch({ type: "SET_CONTEXT", context: newCtx });
      } else {
        emitBotMessage(next, newCtx, () => {
          const afterIdx = nextStepIdx + 1;
          if (afterIdx < steps.length) {
            const afterStep = steps[afterIdx];
            if (afterStep.type === "userInput") {
              emitBotMessage(afterStep, newCtx, () => {
                dispatch({ type: "SET_AWAITING_INPUT", target: "email" });
                dispatch({ type: "SET_STEP_INDEX", index: afterIdx });
              });
            }
          } else {
            emitBotMessage(ASK_PROFILE_STEP, newCtx);
            dispatch({ type: "SET_PHASE", phase: "ask_profile" });
          }
        });
      }
    } else {
      emitBotMessage(ASK_PROFILE_STEP, newCtx);
      dispatch({ type: "SET_PHASE", phase: "ask_profile" });
    }
  }

  function handleFormSubmit(values: Record<string, string>) {
    const name = values["name"] ?? "";
    const email = values["email"] ?? "";

    emitUserMessage(`${name} · ${email}`);

    const newCtx = { ...state.context, name, email };
    dispatch({ type: "SET_CONTEXT", context: { name, email } });

    const receivedStep = VARIANT_B_STEPS.find((s) => s.id === "b_received");
    if (receivedStep) {
      emitBotMessage(receivedStep, newCtx, () => {
        emitBotMessage(ASK_PROFILE_STEP, newCtx);
        dispatch({ type: "SET_PHASE", phase: "ask_profile" });
      });
    }
  }

  function handlePlatformConfirm() {
    if (platformRedirectAnswered.current) return;
    platformRedirectAnswered.current = true;

    emitUserMessage("Confirmado ✓");
    const newCtx = state.context;
    emitBotMessage(
      { id: "c_confirmed", actor: "bot", type: "typing", content: "Confirmado. Creando tu cuenta…", delay: 500, auto: true },
      newCtx,
      () => {
        emitBotMessage(ASK_PROFILE_STEP, newCtx);
        dispatch({ type: "SET_PHASE", phase: "ask_profile" });
      }
    );
  }

  const isDone = state.phase === "done" || state.phase === "bye";
  const showInput = state.awaitingInput && !isDone;

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1C1F2A] shadow-md flex-shrink-0">
        <EspiAvatar size={38} />
        <div className="flex-1 min-w-0">
          <p className="text-white text-[15px] font-semibold leading-tight truncate">{AGENT_FULL_TITLE}</p>
          <p className="text-[#25D366] text-[12px] leading-tight">
            {state.isTyping ? "escribiendo…" : "en línea"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5"
        style={{ background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d1d5db' fill-opacity='0.18'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\") #EAE0D5" }}
      >
        {state.messages.map((msg, idx) => {
          const prevMsg = state.messages[idx - 1];
          const showAvatar = msg.actor === "bot" && (!prevMsg || prevMsg.actor !== "bot");

          if (msg.type === "quickReply" && msg.options) {
            const isAnswered = answeredMessages.current.has(msg.id);
            return (
              <div key={msg.id}>
                <MessageBubble message={msg} showAvatar={showAvatar} />
                {!isAnswered && (
                  <QuickReplies
                    options={msg.options}
                    onSelect={(id, label) => handleQuickReply(msg.id, id, label)}
                    disabled={isAnswered || state.isTyping}
                  />
                )}
              </div>
            );
          }

          if (msg.type === "form" && msg.fields) {
            return (
              <div key={msg.id}>
                <MessageBubble message={msg} showAvatar={showAvatar} />
                <WhatsAppForm
                  fields={msg.fields}
                  onSubmit={handleFormSubmit}
                  disabled={state.phase !== "flow" || state.isTyping}
                />
              </div>
            );
          }

          if (msg.type === "platformRedirect") {
            const isAnswered = platformRedirectAnswered.current;
            return (
              <div key={msg.id}>
                <MessageBubble message={msg} showAvatar={showAvatar} />
                {!isAnswered && (
                  <PlatformRedirectCard
                    name={state.context.name}
                    email={state.context.email}
                    onConfirm={handlePlatformConfirm}
                    disabled={state.isTyping}
                  />
                )}
              </div>
            );
          }

          if (msg.type === "welcome" && msg.options) {
            return (
              <div key={msg.id}>
                <MessageBubble message={msg} showAvatar={showAvatar} />
                <div className="flex flex-col gap-2 mt-2 mb-2 px-2">
                  {msg.options.map((opt) => (
                    <a
                      key={opt.id}
                      href={opt.id}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        block w-full text-center py-3 rounded-full bg-[#FFAA00] text-[#1C1F2A]
                        text-[14px] font-bold hover:bg-[#E69900]
                        transition-all duration-150
                        focus:outline-none focus:ring-2 focus:ring-[#FFAA00]/40
                        min-h-[44px] flex items-center justify-center
                      "
                    >
                      {opt.label}
                    </a>
                  ))}
                </div>
              </div>
            );
          }

          return <MessageBubble key={msg.id} message={msg} showAvatar={showAvatar} />;
        })}

        {state.isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Text input area */}
      <div className="flex-shrink-0 px-3 py-2 bg-[#F0F0F0] border-t border-[#E5E5E5]">
        {showInput ? (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type={state.currentInputTarget === "email" ? "email" : "text"}
              placeholder={state.currentInputTarget === "name" ? "Escribe tu nombre…" : "Escribe tu correo…"}
              value={state.inputValue}
              onChange={(e) => dispatch({ type: "SET_INPUT_VALUE", value: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleTextInput()}
              autoFocus
              className="
                flex-1 bg-white rounded-full px-4 py-2.5
                text-[14px] text-[#1C1F2A] placeholder:text-[#9898A2]
                border border-[#E5E5E5]
                focus:outline-none focus:border-[#FFAA00] focus:ring-2 focus:ring-[#FFAA00]/20
                min-h-[44px]
              "
            />
            <button
              onClick={handleTextInput}
              disabled={!state.inputValue.trim()}
              className="
                w-11 h-11 rounded-full bg-[#FFAA00] flex items-center justify-center flex-shrink-0
                hover:bg-[#E69900] transition-all duration-150
                disabled:opacity-40 disabled:pointer-events-none
                focus:outline-none focus:ring-2 focus:ring-[#FFAA00]/40
              "
              aria-label="Enviar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1C1F2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 opacity-40 pointer-events-none select-none">
            <div className="flex-1 bg-white rounded-full px-4 py-2.5 text-[14px] text-[#9898A2] min-h-[44px] flex items-center">
              {isDone ? UI_HINTS.conversationDone : UI_HINTS.awaitingOptions}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

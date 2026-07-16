"use client";
import { useEffect, useRef, useReducer, useCallback } from "react";
import { chatReducer, initialState, type ChatMessage } from "@/lib/chatReducer";
import { AGENT_FULL_TITLE } from "@/lib/persona";
import { WELCOME_MESSAGES, WELCOME_CTAS, UI_HINTS, type UserProfile } from "@/lib/content";
import { isValidEmail } from "@/lib/validation";
import { getCopy, type Tone } from "@/lib/tone";
import {
  OPENING_STEPS,
  WHATIS_BRANCH_STEPS,
  LATER_STEP,
  VARIANT_A_STEPS,
  VARIANT_B_STEPS,
  VARIANT_C_STEPS,
  PUBLISH_VARIANT_A_STEPS,
  PUBLISH_VARIANT_B_STEPS,
  PUBLISH_VARIANT_C_STEPS,
  ASK_PROFILE_STEP,
  SUCCESS_STEP,
  SUCCESS_STEP_V2,
  A_RECONFIRM_STEP,
  ASK_EMAIL_CORRECTION_STEP,
  ASK_NAME_CORRECTION_STEP,
  V1_ASK_CODE_STEP,
  V1_CODE_SUCCESS_STEP,
  V1_CODE_WRONG_STEP,
  V1_RESENT_STEP,
  EXISTING_USER_STEPS,
  REGISTERED_EMAILS,
  HUMAN_HANDOFF_STEP,
  type Variant,
  type VerificationMethod,
  type Step,
  type ConversationContext,
} from "@/lib/flows";
import EspiAvatar from "./EspiAvatar";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import QuickReplies from "./QuickReplies";
import WhatsAppForm from "./WhatsAppForm";
import PlatformRedirectCard from "./PlatformRedirectCard";
import ListMessage from "./ListMessage";
import PhotoUploadStep from "./PhotoUploadStep";

export type StartMode = "onboarding" | "publish_space";

interface Props {
  variant: Variant;
  verificationMethod: VerificationMethod;
  startMode: StartMode;
  tone: Tone;
}

let msgIdCounter = 0;
function newId() { return `msg-${++msgIdCounter}`; }

function resolveTonedContent(step: Step, tone: Tone, ctx: ConversationContext): string {
  if (step.contentKey) return getCopy(step.contentKey, tone, ctx);
  return typeof step.content === "function" ? step.content(ctx) : step.content;
}

const DEMO_CODE = "123456";

export default function WhatsAppChat({ variant, verificationMethod, startMode, tone }: Props) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const bottomRef = useRef<HTMLDivElement>(null);

  const answeredMessages = useRef<Set<string>>(new Set());
  const platformRedirectAnswered = useRef(false);
  const photosCompletedMessages = useRef<Set<string>>(new Set());
  const verificationCallback = useRef<(() => void) | null>(null);
  // Cuenta intentos inválidos por campo (sin tocar el reducer)
  const invalidAttempts = useRef<Record<string, number>>({});

  // ─── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages, state.isTyping]);

  // ─── Reset on key-prop change (handled by parent key={}) ─────────────────────
  useEffect(() => {
    answeredMessages.current.clear();
    platformRedirectAnswered.current = false;
    photosCompletedMessages.current.clear();
    verificationCallback.current = null;
    invalidAttempts.current = {};
    dispatch({ type: "RESET" });
    msgIdCounter = 0;
  }, [variant, verificationMethod, startMode]);

  // ─── Bot message emitter ─────────────────────────────────────────────────────
  const emitBotMessage = useCallback(
    (step: Step, ctx: ConversationContext, onDone?: () => void) => {
      dispatch({ type: "SET_TYPING", value: true });
      setTimeout(() => {
        dispatch({ type: "SET_TYPING", value: false });
        dispatch({
          type: "ADD_MESSAGE",
          message: {
            id: newId(),
            actor: "bot",
            type: step.type as ChatMessage["type"],
            content: resolveTonedContent(step, tone, ctx),
            options: step.options,
            fields: step.fields,
            listItems: step.listItems,
            listButtonLabel: step.listButtonLabel,
            timestamp: new Date(),
            ticks: "read",
          },
        });
        onDone?.();
      }, step.delay ?? 800);
    },
    [tone]
  );

  const emitBotError = useCallback((text: string) => {
    dispatch({ type: "SET_TYPING", value: true });
    setTimeout(() => {
      dispatch({ type: "SET_TYPING", value: false });
      dispatch({
        type: "ADD_MESSAGE",
        message: { id: newId(), actor: "bot", type: "text", content: text, timestamp: new Date(), ticks: "read" },
      });
    }, 600);
  }, []);

  const emitUserMessage = useCallback((content: string) => {
    dispatch({
      type: "ADD_MESSAGE",
      message: { id: newId(), actor: "user", type: "text", content, timestamp: new Date(), ticks: "read" },
    });
  }, []);

  // ─── Verification branch (V0/V1/V2) ─────────────────────────────────────────
  const runVerification = useCallback(
    (ctx: ConversationContext, onComplete: () => void) => {
      if (verificationMethod === "V0" || verificationMethod === "V2") {
        onComplete();
        return;
      }
      const askStep = V1_ASK_CODE_STEP(ctx.email);
      emitBotMessage(askStep, ctx, () => {
        dispatch({ type: "SET_AWAITING_INPUT", target: "verif_code" });
        dispatch({ type: "SET_PHASE", phase: "flow" });
        verificationCallback.current = onComplete;
      });
    },
    [verificationMethod, emitBotMessage]
  );

  // ─── Proceed to profile (all variants after data collection) ─────────────────
  const proceedToProfile = useCallback(
    (ctx: ConversationContext, preStep?: Step) => {
      const doProfile = () => {
        emitBotMessage(ASK_PROFILE_STEP, ctx);
        dispatch({ type: "SET_PHASE", phase: "ask_profile" });
      };
      const doVerifyThenProfile = () => runVerification(ctx, doProfile);
      if (preStep) {
        emitBotMessage(preStep, ctx, doVerifyThenProfile);
      } else {
        doVerifyThenProfile();
      }
    },
    [emitBotMessage, runVerification]
  );

  // ─── Success (onboarding) ────────────────────────────────────────────────────
  const runSuccess = useCallback(
    (ctx: ConversationContext) => {
      const profile = ctx.profile ?? "propietario";
      const successStep = verificationMethod === "V2" ? SUCCESS_STEP_V2 : SUCCESS_STEP;
      emitBotMessage(successStep, ctx, () => {
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
    [emitBotMessage, verificationMethod]
  );

  // ─── Publish space flow ───────────────────────────────────────────────────────
  const runPublishSpaceFlow = useCallback(
    (ctx: ConversationContext) => {
      if (variant === "B") {
        const introStep = PUBLISH_VARIANT_B_STEPS.find((s) => s.id === "publish_intro")!;
        const formStep  = PUBLISH_VARIANT_B_STEPS.find((s) => s.id === "publish_form_b")!;
        emitBotMessage(introStep, ctx, () => {
          emitBotMessage(formStep, ctx);
          dispatch({ type: "SET_PHASE", phase: "publish_form_b" });
          dispatch({ type: "SET_CONTEXT", context: ctx });
        });
      } else {
        // Variante A y C: intro → list de tipos
        const stepsRef = variant === "C" ? PUBLISH_VARIANT_C_STEPS : PUBLISH_VARIANT_A_STEPS;
        const introStep = stepsRef.find((s) => s.id === "publish_intro")!;
        const typeStep  = stepsRef.find((s) => s.id === "publish_type")!;
        const typeIdx   = stepsRef.findIndex((s) => s.id === "publish_type");
        emitBotMessage(introStep, ctx, () => {
          emitBotMessage(typeStep, ctx);
          dispatch({ type: "SET_PHASE", phase: "publish_type" });
          dispatch({ type: "SET_STEP_INDEX", index: typeIdx });
          dispatch({ type: "SET_CONTEXT", context: ctx });
        });
      }
    },
    [variant, emitBotMessage]
  );

  // ─── Variant flow orchestrator ───────────────────────────────────────────────
  const runVariantFlow = useCallback(
    (ctx: ConversationContext) => {
      const steps =
        variant === "A" ? VARIANT_A_STEPS : variant === "B" ? VARIANT_B_STEPS : VARIANT_C_STEPS;
      let stepIdx = 0;

      function runStep(currentCtx: ConversationContext) {
        if (stepIdx >= steps.length) {
          proceedToProfile(currentCtx);
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
        emitBotMessage(step, currentCtx, () => { stepIdx++; runStep(currentCtx); });
      }

      runStep(ctx);
    },
    [variant, emitBotMessage, proceedToProfile]
  );

  // ─── Start conversation ───────────────────────────────────────────────────────
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
      photosCompletedMessages.current.clear();
      verificationCallback.current = null;
      msgIdCounter = 0;
    }

    const ctx: ConversationContext = { name: "", email: "", profile: null };

    if (startMode === "publish_space") {
      dispatch({ type: "SET_TYPING", value: true });
      const t = setTimeout(() => {
        if (cancelled) return;
        dispatch({ type: "SET_TYPING", value: false });
        runPublishSpaceFlow(ctx);
      }, 400);
      timers.push(t);
    } else {
      let i = 0;
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
              content: resolveTonedContent(step, tone, ctx),
              options: step.options,
              timestamp: new Date(),
              ticks: "read" as const,
            },
          });
          if (step.requiresInput) {
            dispatch({ type: "SET_PHASE", phase: "opening" });
          } else { i++; runOpening(); }
        }, step.delay ?? 800);
      }
      safeTimeout(runOpening, 400);
    }

    return cancelAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant, verificationMethod, startMode]);

  // ─── Quick reply handler ──────────────────────────────────────────────────────
  function handleQuickReply(msgId: string, optId: string, optLabel: string) {
    if (answeredMessages.current.has(msgId)) return;
    answeredMessages.current.add(msgId);
    emitUserMessage(optLabel);
    const ctx = state.context;

    if (state.phase === "opening") {
      if (optId === "start") { runVariantFlow(ctx); }
      else if (optId === "whatis") { dispatch({ type: "SET_PHASE", phase: "whatis" }); emitBotMessage(WHATIS_BRANCH_STEPS[0], ctx); }
      else if (optId === "later") { emitBotMessage(LATER_STEP, ctx); dispatch({ type: "SET_PHASE", phase: "bye" }); }
      return;
    }

    if (state.phase === "whatis") {
      if (optId === "start") { runVariantFlow(ctx); }
      else { emitBotMessage(LATER_STEP, ctx); dispatch({ type: "SET_PHASE", phase: "bye" }); }
      return;
    }

    if (state.phase === "flow") {
      if (optId === "confirm") {
        const creatingStep = VARIANT_A_STEPS.find((s) => s.id === "a_creating");
        proceedToProfile(ctx, creatingStep);
      } else if (optId === "edit_email") {
        emitBotMessage(ASK_EMAIL_CORRECTION_STEP, ctx, () => {
          dispatch({ type: "SET_AWAITING_INPUT", target: "email" });
          dispatch({ type: "SET_CORRECTION_MODE", mode: "email" });
        });
      } else if (optId === "edit_name") {
        emitBotMessage(ASK_NAME_CORRECTION_STEP, ctx, () => {
          dispatch({ type: "SET_AWAITING_INPUT", target: "name" });
          dispatch({ type: "SET_CORRECTION_MODE", mode: "name" });
        });
      } else if (optId === "resend_code") {
        emitBotMessage(V1_RESENT_STEP, ctx, () => {
          dispatch({ type: "SET_AWAITING_INPUT", target: "verif_code" });
        });
      }
      return;
    }

    if (state.phase === "ask_profile") {
      const profile = optId as UserProfile;
      dispatch({ type: "SET_CONTEXT", context: { profile } });
      runSuccess({ ...ctx, profile });
      return;
    }

    if (state.phase === "existing_user") {
      if (optId === "existing_login") {
        emitBotMessage(EXISTING_USER_STEPS[1], ctx);
        dispatch({ type: "SET_PHASE", phase: "bye" });
      } else if (optId === "existing_retry_email") {
        emitBotMessage(EXISTING_USER_STEPS[2], ctx, () => {
          dispatch({ type: "SET_AWAITING_INPUT", target: "email" });
        });
        dispatch({ type: "SET_PHASE", phase: "flow" });
      }
      return;
    }

    if (state.phase === "publish_confirm") {
      if (optId === "space_publish") {
        const stepsRef = variant === "B" ? PUBLISH_VARIANT_B_STEPS : PUBLISH_VARIANT_A_STEPS;
        const creatingStep = stepsRef.find((s) => s.id === "publish_creating")!;
        const successStep  = stepsRef.find((s) => s.id === "publish_success")!;
        emitBotMessage(creatingStep, ctx, () => {
          emitBotMessage(successStep, ctx, () => {
            const doneMsg: ChatMessage = {
              id: newId(),
              actor: "bot",
              type: "welcome",
              content: getCopy("done_welcome_q", tone, ctx),
              options: [
                { id: "https://spot2.mx/espacios", label: "Ver mi espacio" },
                { id: "https://spot2.mx/dashboard", label: "Ver el dashboard" },
              ],
              timestamp: new Date(),
              ticks: "read",
            };
            setTimeout(() => {
              dispatch({ type: "ADD_MESSAGE", message: doneMsg });
              dispatch({ type: "SET_PHASE", phase: "publish_done" });
            }, 800);
          });
        });
      } else if (optId === "space_edit") {
        if (variant === "B") {
          // Variante B: muestra el formulario de nuevo
          const formStep = PUBLISH_VARIANT_B_STEPS.find((s) => s.id === "publish_form_b")!;
          emitBotMessage(
            { id: "edit_restart", actor: "bot", type: "text", content: getCopy("publish_edit_restart_b", tone, ctx), delay: 600 },
            ctx,
            () => {
              emitBotMessage(formStep, ctx);
              dispatch({ type: "SET_PHASE", phase: "publish_form_b" });
            }
          );
        } else {
          // Variante A: reinicia desde tipo de espacio
          const typeStep = PUBLISH_VARIANT_A_STEPS.find((s) => s.id === "publish_type")!;
          const typeIdx  = PUBLISH_VARIANT_A_STEPS.findIndex((s) => s.id === "publish_type");
          emitBotMessage(
            { id: "edit_restart", actor: "bot", type: "text", content: getCopy("publish_edit_restart_a", tone, ctx), delay: 600 },
            ctx,
            () => {
              emitBotMessage(typeStep, ctx);
              dispatch({ type: "SET_PHASE", phase: "publish_type" });
              dispatch({ type: "SET_STEP_INDEX", index: typeIdx });
            }
          );
        }
      }
      return;
    }
  }

  // ─── List select handler ──────────────────────────────────────────────────────
  function handleListSelect(msgId: string, itemId: string, itemTitle: string) {
    if (answeredMessages.current.has(msgId)) return;
    answeredMessages.current.add(msgId);
    emitUserMessage(itemTitle);

    const newCtx = { ...state.context, spaceType: itemTitle };
    dispatch({ type: "SET_CONTEXT", context: { spaceType: itemTitle } });

    // A y C: ambas van a publish_size tras seleccionar tipo
    const stepsRef = variant === "C" ? PUBLISH_VARIANT_C_STEPS : PUBLISH_VARIANT_A_STEPS;
    const sizeStep = stepsRef.find((s) => s.id === "publish_size")!;
    const sizeIdx  = stepsRef.findIndex((s) => s.id === "publish_size");
    emitBotMessage(sizeStep, newCtx, () => {
      dispatch({ type: "SET_AWAITING_INPUT", target: "size" });
      dispatch({ type: "SET_PHASE", phase: "publish_size" });
      dispatch({ type: "SET_STEP_INDEX", index: sizeIdx });
    });
  }

  // ─── Photos complete handler ──────────────────────────────────────────────────
  function handlePhotosComplete(msgId: string) {
    photosCompletedMessages.current.add(msgId);
    const ctx = state.context;
    const stepsRef = variant === "B" ? PUBLISH_VARIANT_B_STEPS : PUBLISH_VARIANT_A_STEPS;
    const confirmStep = stepsRef.find((s) => s.id === "publish_confirm")!;
    const confirmIdx  = stepsRef.findIndex((s) => s.id === "publish_confirm");
    emitBotMessage(confirmStep, ctx);
    dispatch({ type: "SET_PHASE", phase: "publish_confirm" });
    dispatch({ type: "SET_STEP_INDEX", index: confirmIdx });
  }

  // ─── Detección de fricción ────────────────────────────────────────────────────

  function isUnknownData(val: string) {
    return /^(no sé|no lo sé|nse|ns|no tengo|no lo tengo|no recuerdo|no lo recuerdo|desconozco|no lo conozco|no lo tenemos|no me acuerdo|no sé exacto|no sé bien|\?+|no idea|ni idea|no aplica|n\/a)$/i.test(val.trim());
  }

  function isFrustrated(val: string) {
    return /ya olvídalo|olvídalo|olvidalo|ya no quiero|es muy largo|muy largo|tarda mucho|no funciona|no sirve|para qué|para que hago esto|basta ya|basta|me rindo|déjalo|dejalo|ya me cansé|me cansé|esto no funciona|no me interesa ya|cancela|ya no|déjame en paz|dejame en paz/i.test(val);
  }

  function isTrustQuestion(val: string) {
    return /es (esto )?seguro|¿seguro|quién eres|quien eres|por qué tienes (mi|este)|por que tienes (mi|este)|mi número|mi correo (para qué|para que)|para qué quieres (mis datos|el correo|mi)|para que quieres (mis datos|el correo|mi)|no confío|no confio|eres real|es real esto|eres un bot|eres bot|quién es espi|quien es espi/i.test(val);
  }

  function isReturningGreeting(val: string) {
    return /^(hola|buenas|hey|sigues ahí|sigues ahi|estás ahí|estas ahí|oye|oiga|oi|hi|¿sigues ahí\??|¿hola\??)$/i.test(val.trim());
  }

  function isHumanRequest(val: string) {
    return /quiero hablar (con )?(una persona|un humano|un asesor|un agente|alguien)|hablar con (una persona|un humano|un asesor|un agente|alguien)|necesito (a )?alguien|ponme con (una persona|un humano|un asesor|alguien)|pásame (con )?(una persona|un humano|un asesor|un agente|alguien)|pasame (con )?(una persona|un asesor|un agente|alguien)|quiero (una persona|un humano|un agente|un asesor)|hablar con un humano|un agente (real|humano)|persona real|soporte humano|servicio al cliente|atención al cliente/i.test(val);
  }

  // ─── Text input handler ───────────────────────────────────────────────────────
  function handleTextInput() {
    const val = state.inputValue.trim();
    if (!val) return;

    // V1 — OTP
    if (state.currentInputTarget === "verif_code") {
      emitUserMessage(val);
      dispatch({ type: "SET_INPUT_VALUE", value: "" });
      dispatch({ type: "SET_AWAITING_INPUT", target: null });
      if (val === DEMO_CODE) {
        emitBotMessage(V1_CODE_SUCCESS_STEP, state.context, () => {
          verificationCallback.current?.();
          verificationCallback.current = null;
        });
      } else {
        emitBotMessage(V1_CODE_WRONG_STEP, state.context);
      }
      return;
    }

    // Publish flow — m²
    if (state.phase === "publish_size") {
      // "No sé" — ofrece aproximado o placeholder
      if (isUnknownData(val)) {
        emitUserMessage(val);
        dispatch({ type: "SET_INPUT_VALUE", value: "" });
        emitBotError(getCopy("dont_know_size", tone, state.context));
        return;
      }
      // Frustración / desconfianza tienen prioridad sobre validación numérica
      if (isTrustQuestion(val)) {
        emitUserMessage(val);
        dispatch({ type: "SET_INPUT_VALUE", value: "" });
        emitBotError(getCopy("trust_question", tone, state.context));
        return;
      }
      if (isFrustrated(val)) {
        emitUserMessage(val);
        dispatch({ type: "SET_INPUT_VALUE", value: "" });
        emitBotError(getCopy("frustration_publish", tone, state.context));
        return;
      }
      // Validación numérica con escalada de 3 intentos
      if (!/^\d+([.,]\d+)?$/.test(val)) {
        emitUserMessage(val);
        dispatch({ type: "SET_INPUT_VALUE", value: "" });
        const attempts = (invalidAttempts.current["size"] ?? 0) + 1;
        invalidAttempts.current["size"] = attempts;
        const key = attempts >= 3 ? "size_invalid_3" : attempts === 2 ? "size_invalid_2" : "size_invalid_1";
        emitBotError(getCopy(key, tone, state.context));
        return;
      }
      // Input válido — limpiar contador
      invalidAttempts.current["size"] = 0;
      emitUserMessage(val);
      dispatch({ type: "SET_INPUT_VALUE", value: "" });
      dispatch({ type: "SET_AWAITING_INPUT", target: null });
      const newCtx = { ...state.context, spaceSize: val };
      dispatch({ type: "SET_CONTEXT", context: { spaceSize: val } });
      if (variant === "C") {
        const redirectStep = PUBLISH_VARIANT_C_STEPS.find((s) => s.id === "publish_redirect_c")!;
        emitBotMessage(redirectStep, newCtx);
        dispatch({ type: "SET_PHASE", phase: "publish_redirect_c" });
      } else {
        const priceStep = PUBLISH_VARIANT_A_STEPS.find((s) => s.id === "publish_price")!;
        const priceIdx  = PUBLISH_VARIANT_A_STEPS.findIndex((s) => s.id === "publish_price");
        emitBotMessage(priceStep, newCtx, () => {
          dispatch({ type: "SET_AWAITING_INPUT", target: "price" });
          dispatch({ type: "SET_PHASE", phase: "publish_price" });
          dispatch({ type: "SET_STEP_INDEX", index: priceIdx });
        });
      }
      return;
    }

    // Publish flow — precio (variante A)
    if (state.phase === "publish_price") {
      // "No sé" — ofrece precio tentativo
      if (isUnknownData(val)) {
        emitUserMessage(val);
        dispatch({ type: "SET_INPUT_VALUE", value: "" });
        emitBotError(getCopy("dont_know_price", tone, state.context));
        return;
      }
      // Frustración / desconfianza tienen prioridad sobre validación numérica
      if (isTrustQuestion(val)) {
        emitUserMessage(val);
        dispatch({ type: "SET_INPUT_VALUE", value: "" });
        emitBotError(getCopy("trust_question", tone, state.context));
        return;
      }
      if (isFrustrated(val)) {
        emitUserMessage(val);
        dispatch({ type: "SET_INPUT_VALUE", value: "" });
        emitBotError(getCopy("frustration_publish", tone, state.context));
        return;
      }
      // Validación numérica con escalada
      if (!/^\d+([.,]\d+)?$/.test(val)) {
        emitUserMessage(val);
        dispatch({ type: "SET_INPUT_VALUE", value: "" });
        const attempts = (invalidAttempts.current["price"] ?? 0) + 1;
        invalidAttempts.current["price"] = attempts;
        const key = attempts >= 3 ? "price_invalid_3" : attempts === 2 ? "price_invalid_2" : "price_invalid_1";
        emitBotError(getCopy(key, tone, state.context));
        return;
      }
      invalidAttempts.current["price"] = 0;
      emitUserMessage(val);
      dispatch({ type: "SET_INPUT_VALUE", value: "" });
      dispatch({ type: "SET_AWAITING_INPUT", target: null });
      const newCtx = { ...state.context, spacePrice: val };
      dispatch({ type: "SET_CONTEXT", context: { spacePrice: val } });
      const addressStep = PUBLISH_VARIANT_A_STEPS.find((s) => s.id === "publish_address")!;
      const addressIdx  = PUBLISH_VARIANT_A_STEPS.findIndex((s) => s.id === "publish_address");
      emitBotMessage(addressStep, newCtx);
      dispatch({ type: "SET_PHASE", phase: "publish_address" });
      dispatch({ type: "SET_STEP_INDEX", index: addressIdx });
      return;
    }

    // Detección de desconfianza (cualquier input de texto libre)
    if (isTrustQuestion(val)) {
      emitUserMessage(val);
      dispatch({ type: "SET_INPUT_VALUE", value: "" });
      emitBotError(getCopy("trust_question", tone, state.context));
      return;
    }

    // Detección de frustración
    if (isFrustrated(val)) {
      emitUserMessage(val);
      dispatch({ type: "SET_INPUT_VALUE", value: "" });
      const frustKey = startMode === "publish_space" ? "frustration_publish" : "frustration_onboarding";
      emitBotError(getCopy(frustKey, tone, state.context));
      return;
    }

    // Solicitud explícita de hablar con un humano
    if (isHumanRequest(val)) {
      emitUserMessage(val);
      dispatch({ type: "SET_INPUT_VALUE", value: "" });
      emitBotMessage(HUMAN_HANDOFF_STEP, state.context, () => {
        dispatch({ type: "SET_PHASE", phase: "bye" });
      });
      return;
    }

    // Detección de retomada (saludo inesperado con contexto ya parcialmente cargado)
    if (isReturningGreeting(val) && state.context.name) {
      emitUserMessage(val);
      dispatch({ type: "SET_INPUT_VALUE", value: "" });
      const resumeKey = state.context.email ? "resume_with_email" : "resume_with_name_no_email";
      emitBotError(getCopy(resumeKey, tone, state.context));
      // Re-activar el input target correcto
      if (!state.context.email) {
        dispatch({ type: "SET_AWAITING_INPUT", target: "email" });
      }
      return;
    }

    // Validar correo
    if (state.currentInputTarget === "email" && !isValidEmail(val)) {
      emitUserMessage(val);
      dispatch({ type: "SET_INPUT_VALUE", value: "" });
      emitBotError(getCopy("email_error", tone, state.context));
      return;
    }

    emitUserMessage(val);
    dispatch({ type: "SET_INPUT_VALUE", value: "" });
    const target = state.currentInputTarget;
    const newCtx = { ...state.context, [target ?? "name"]: val };
    dispatch({ type: "SET_CONTEXT", context: { [target ?? "name"]: val } });
    dispatch({ type: "SET_AWAITING_INPUT", target: null });

    // Branch: correo ya registrado
    if (target === "email" && REGISTERED_EMAILS.has(val.toLowerCase())) {
      emitBotMessage(EXISTING_USER_STEPS[0], newCtx);
      dispatch({ type: "SET_PHASE", phase: "existing_user" });
      return;
    }

    // Corrección granular
    if (state.correctionMode !== null) {
      dispatch({ type: "SET_CORRECTION_MODE", mode: null });
      emitBotMessage(A_RECONFIRM_STEP, newCtx);
      dispatch({ type: "SET_PHASE", phase: "flow" });
      return;
    }

    // Flujo normal (variantes A/B/C)
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
        emitBotMessage(next, newCtx);
        dispatch({ type: "SET_PHASE", phase: "flow" });
        dispatch({ type: "SET_STEP_INDEX", index: nextStepIdx });
        dispatch({ type: "SET_CONTEXT", context: newCtx });
      } else {
        emitBotMessage(next, newCtx, () => {
          const afterIdx = nextStepIdx + 1;
          if (afterIdx < steps.length && steps[afterIdx].type === "userInput") {
            emitBotMessage(steps[afterIdx], newCtx, () => {
              dispatch({ type: "SET_AWAITING_INPUT", target: "email" });
              dispatch({ type: "SET_STEP_INDEX", index: afterIdx });
            });
          } else {
            proceedToProfile(newCtx);
          }
        });
      }
    } else {
      proceedToProfile(newCtx);
    }
  }

  // ─── Form submit handler ──────────────────────────────────────────────────────
  function handleFormSubmit(values: Record<string, string>) {
    // Variante B de publicar espacio — form unificado (tiene campo "espacio_tipo")
    if (values.espacio_tipo !== undefined) {
      const spaceType = values.espacio_tipo;
      const size   = (values.tamaño  ?? "").trim();
      const price  = (values.precio  ?? "").trim();
      const street = (values.calle   ?? "").trim();
      const number = (values.numero  ?? "").trim();
      const zip    = (values.cp      ?? "").trim();
      emitUserMessage(`${spaceType} · ${size} m² · $${price}/mes · ${street} ${number}, CP ${zip}`);
      const newCtx = { ...state.context, spaceType, spaceSize: size, spacePrice: price, spaceStreet: street, spaceNumber: number, spaceZip: zip };
      dispatch({ type: "SET_CONTEXT", context: { spaceType, spaceSize: size, spacePrice: price, spaceStreet: street, spaceNumber: number, spaceZip: zip } });
      const photosStep = PUBLISH_VARIANT_B_STEPS.find((s) => s.id === "publish_photos")!;
      emitBotMessage(photosStep, newCtx);
      dispatch({ type: "SET_PHASE", phase: "publish_photos" });
      return;
    }

    // Publish address form — variante A (tiene campo "calle" pero no "espacio_tipo")
    if (values.calle !== undefined) {
      const street = values.calle.trim();
      const number = (values.numero ?? "").trim();
      const zip    = (values.cp ?? "").trim();
      emitUserMessage(`${street} ${number}, CP ${zip}`);
      const newCtx = { ...state.context, spaceStreet: street, spaceNumber: number, spaceZip: zip };
      dispatch({ type: "SET_CONTEXT", context: { spaceStreet: street, spaceNumber: number, spaceZip: zip } });
      const photosStep = PUBLISH_VARIANT_A_STEPS.find((s) => s.id === "publish_photos")!;
      const photosIdx  = PUBLISH_VARIANT_A_STEPS.findIndex((s) => s.id === "publish_photos");
      emitBotMessage(photosStep, newCtx);
      dispatch({ type: "SET_PHASE", phase: "publish_photos" });
      dispatch({ type: "SET_STEP_INDEX", index: photosIdx });
      return;
    }

    // Variante B — crear cuenta
    const name = values["name"] ?? "";
    const email = values["email"] ?? "";
    const profileRaw = values["profile"] ?? "";
    const profile: UserProfile | null =
      profileRaw === "Soy propietario"   ? "propietario"
      : profileRaw === "Soy broker"      ? "broker"
      : profileRaw === "Soy desarrollador" ? "desarrollador"
      : null;

    const summary = profile ? `${name} · ${email} · ${profileRaw}` : `${name} · ${email}`;
    emitUserMessage(summary);

    const newCtx = { ...state.context, name, email, profile };
    dispatch({ type: "SET_CONTEXT", context: { name, email, profile } });

    const receivedStep = VARIANT_B_STEPS.find((s) => s.id === "b_received");

    if (profile) {
      const doSuccess = () => runSuccess(newCtx);
      if (receivedStep) {
        emitBotMessage(receivedStep, newCtx, doSuccess);
      } else {
        doSuccess();
      }
    } else {
      proceedToProfile(newCtx, receivedStep);
    }
  }

  function handlePlatformConfirm() {
    if (platformRedirectAnswered.current) return;
    platformRedirectAnswered.current = true;
    emitUserMessage("Abriendo Spot2 ✓");

    // Variante C de publicar espacio
    if (state.phase === "publish_redirect_c") {
      const successStep = PUBLISH_VARIANT_C_STEPS.find((s) => s.id === "publish_success_c")!;
      emitBotMessage(successStep, state.context, () => {
        const doneMsg: ChatMessage = {
          id: newId(),
          actor: "bot",
          type: "welcome",
          content: getCopy("done_welcome_q", tone, state.context),
          options: [
            { id: "https://spot2.mx/espacios", label: "Ver mi espacio" },
            { id: "https://spot2.mx/dashboard", label: "Ver el dashboard" },
          ],
          timestamp: new Date(),
          ticks: "read",
        };
        setTimeout(() => {
          dispatch({ type: "ADD_MESSAGE", message: doneMsg });
          dispatch({ type: "SET_PHASE", phase: "publish_done" });
        }, 800);
      });
      return;
    }

    // Onboarding variante C
    const confirmedStep: Step = {
      id: "c_confirmed",
      actor: "bot",
      type: "typing",
      content: getCopy("onboarding_c_confirmed", tone, state.context),
      delay: 500,
      auto: true,
    };
    proceedToProfile(state.context, confirmedStep);
  }

  // ─── Welcome CTA action dispatch ──────────────────────────────────────────────
  function handleWelcomeCTAAction(action: string) {
    if (action === "publish_space") {
      runPublishSpaceFlow(state.context);
    }
  }

  const isDone = state.phase === "done" || state.phase === "bye" || state.phase === "publish_done";
  const showInput = state.awaitingInput && !isDone;

  const inputPlaceholder =
    state.currentInputTarget === "verif_code" ? "Escribe el código de 6 dígitos…"
    : state.currentInputTarget === "name"      ? "Escribe tu nombre…"
    : state.currentInputTarget === "size"      ? "Ej. 250"
    : state.currentInputTarget === "price"     ? "Ej. 25000"
    : "Escribe tu correo…";

  const inputType =
    state.currentInputTarget === "email" ? "email"
    : "text";

  const isPublishFormPhase = state.phase === "publish_address" || state.phase === "publish_form_b";

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full w-full relative">
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
            const isAddressForm   = msg.fields.some((f) => f.id === "calle") && !msg.fields.some((f) => f.id === "espacio_tipo");
            const isPublishBForm  = msg.fields.some((f) => f.id === "espacio_tipo");
            return (
              <div key={msg.id}>
                <MessageBubble message={msg} showAvatar={showAvatar} />
                <WhatsAppForm
                  fields={msg.fields}
                  onSubmit={handleFormSubmit}
                  disabled={!(state.phase === "flow" || isPublishFormPhase) || state.isTyping}
                  title={isPublishBForm ? "Datos del espacio" : isAddressForm ? "Ubicación del espacio" : undefined}
                  submitLabel={isPublishBForm ? "Guardar datos" : isAddressForm ? "Guardar dirección" : undefined}
                />
              </div>
            );
          }

          if (msg.type === "list" && msg.listItems) {
            const isAnswered = answeredMessages.current.has(msg.id);
            return (
              <div key={msg.id}>
                <MessageBubble message={msg} showAvatar={showAvatar} />
                {!isAnswered && (
                  <ListMessage
                    items={msg.listItems}
                    buttonLabel={msg.listButtonLabel ?? "Ver opciones"}
                    onSelect={(id, title) => handleListSelect(msg.id, id, title)}
                    disabled={state.isTyping}
                  />
                )}
              </div>
            );
          }

          if (msg.type === "photoUpload") {
            const isAnswered = photosCompletedMessages.current.has(msg.id);
            return (
              <div key={msg.id}>
                <MessageBubble message={msg} showAvatar={showAvatar} />
                {!isAnswered && (
                  <PhotoUploadStep
                    onComplete={() => handlePhotosComplete(msg.id)}
                    disabled={state.phase !== "publish_photos" || state.isTyping}
                  />
                )}
              </div>
            );
          }

          if (msg.type === "platformRedirect") {
            const isAnswered   = platformRedirectAnswered.current;
            const isSpaceRedirect = startMode === "publish_space";
            return (
              <div key={msg.id}>
                <MessageBubble message={msg} showAvatar={showAvatar} />
                {!isAnswered && (
                  <PlatformRedirectCard
                    name={state.context.name}
                    email={state.context.email}
                    mode={isSpaceRedirect ? "space" : "account"}
                    spaceType={state.context.spaceType}
                    spaceSize={state.context.spaceSize}
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
                  {msg.options.map((opt) => {
                    if (opt.id.startsWith("action:")) {
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleWelcomeCTAAction(opt.id.slice(7))}
                          className="block w-full text-center py-3 rounded-full bg-[#FFAA00] text-[#1C1F2A] text-[14px] font-bold hover:bg-[#E69900] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FFAA00]/40 min-h-[44px] flex items-center justify-center"
                        >
                          {opt.label}
                        </button>
                      );
                    }
                    return (
                      <a
                        key={opt.id}
                        href={opt.id}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center py-3 rounded-full bg-[#FFAA00] text-[#1C1F2A] text-[14px] font-bold hover:bg-[#E69900] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FFAA00]/40 min-h-[44px] flex items-center justify-center"
                      >
                        {opt.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          }

          return <MessageBubble key={msg.id} message={msg} showAvatar={showAvatar} />;
        })}

        {state.isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Text input */}
      <div className="flex-shrink-0 px-3 py-2 bg-[#F0F0F0] border-t border-[#E5E5E5]">
        {showInput ? (
          <div className="flex items-center gap-2">
            <input
              type={inputType}
              placeholder={inputPlaceholder}
              value={state.inputValue}
              onChange={(e) => dispatch({ type: "SET_INPUT_VALUE", value: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleTextInput()}
              autoFocus
              className="flex-1 bg-white rounded-full px-4 py-2.5 text-[14px] text-[#1C1F2A] placeholder:text-[#9898A2] border border-[#E5E5E5] focus:outline-none focus:border-[#FFAA00] focus:ring-2 focus:ring-[#FFAA00]/20 min-h-[44px]"
            />
            <button
              onClick={handleTextInput}
              disabled={!state.inputValue.trim()}
              className="w-11 h-11 rounded-full bg-[#FFAA00] flex items-center justify-center flex-shrink-0 hover:bg-[#E69900] transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-[#FFAA00]/40"
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

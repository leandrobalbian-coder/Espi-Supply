"use client";
import { useState } from "react";
import { isValidEmail } from "@/lib/validation";

interface Field {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  options?: string[];
  optional?: boolean;
  disables?: string; // id del campo que este checkbox deshabilita cuando está marcado
}

interface Props {
  fields: Field[];
  onSubmit: (values: Record<string, string>) => void;
  disabled?: boolean;
  title?: string;
  submitLabel?: string;
}

export default function WhatsAppForm({ fields, onSubmit, disabled, title = "Crear cuenta en Spot2", submitLabel = "Crear mi cuenta" }: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.id, ""]))
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Checkboxes que están marcados — su campo "disables" queda exento de validación
  function getDisabledByCheckbox(): Set<string> {
    const disabled = new Set<string>();
    fields.forEach((f) => {
      if (f.type === "checkbox" && values[f.id] === "true" && f.disables) {
        disabled.add(f.disables);
      }
    });
    return disabled;
  }

  function validate() {
    const errs: Record<string, string> = {};
    const disabledByCheckbox = getDisabledByCheckbox();
    fields.forEach((f) => {
      if (f.type === "checkbox") return;
      if (f.optional) return;
      if (disabledByCheckbox.has(f.id)) return;
      if (!values[f.id]?.trim()) errs[f.id] = "Campo requerido";
      if (f.type === "email" && values[f.id] && !isValidEmail(values[f.id])) {
        errs[f.id] = "Ingresa un correo válido";
      }
      if (f.type === "password" && values[f.id] && values[f.id].length < 8) {
        errs[f.id] = "Mínimo 8 caracteres";
      }
    });
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(values);
  }

  return (
    <div className="bg-white rounded-2xl rounded-bl-sm shadow-sm mx-2 overflow-hidden border border-[#E5E5E5] animate-fadeIn">
      {/* Header style WhatsApp Flow */}
      <div className="bg-[#1C1F2A] px-4 py-3 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#FFAA00]" />
        <span className="text-white text-[13px] font-semibold">{title}</span>
      </div>
      <form onSubmit={handleSubmit} className="px-4 py-4 flex flex-col gap-3">
        {fields.map((field) => {
          const isDisabledByCheckbox = getDisabledByCheckbox().has(field.id);
          return (
            <div key={field.id}>
              {field.type === "checkbox" ? (
                // OptIn nativo de WhatsApp Flows — simula checkbox/toggle
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={values[field.id] === "true"}
                    onChange={(e) => {
                      setValues({ ...values, [field.id]: e.target.checked ? "true" : "false" });
                    }}
                    disabled={disabled}
                    className="mt-0.5 w-4 h-4 rounded border-[#CCCDD1] accent-[#FFAA00] disabled:opacity-50 flex-shrink-0"
                  />
                  <span className="text-[12px] text-[#424552] leading-tight">{field.label}</span>
                </label>
              ) : (
                <>
                  <label className="text-[12px] font-semibold text-[#424552] block mb-1">
                    {field.label}
                    {isDisabledByCheckbox && (
                      <span className="ml-1 font-normal text-[#9898A2]">(usando clave temporal)</span>
                    )}
                  </label>
                  {field.type === "select" ? (
                    <select
                      value={values[field.id]}
                      onChange={(e) => {
                        setValues({ ...values, [field.id]: e.target.value });
                        setErrors({ ...errors, [field.id]: "" });
                      }}
                      disabled={disabled || isDisabledByCheckbox}
                      className="
                        w-full border border-[#CCCDD1] rounded-lg px-3 py-2.5
                        text-[13px] text-[#1C1F2A] bg-white appearance-none
                        focus:outline-none focus:border-[#FFAA00] focus:ring-2 focus:ring-[#FFAA00]/20
                        disabled:opacity-40
                      "
                    >
                      <option value="" disabled>{field.placeholder}</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={isDisabledByCheckbox ? "" : values[field.id]}
                      onChange={(e) => {
                        setValues({ ...values, [field.id]: e.target.value });
                        setErrors({ ...errors, [field.id]: "" });
                      }}
                      disabled={disabled || isDisabledByCheckbox}
                      className="
                        w-full border border-[#CCCDD1] rounded-lg px-3 py-2.5
                        text-[13px] text-[#1C1F2A] placeholder:text-[#9898A2]
                        focus:outline-none focus:border-[#FFAA00] focus:ring-2 focus:ring-[#FFAA00]/20
                        disabled:opacity-40
                      "
                    />
                  )}
                  {errors[field.id] && (
                    <p className="text-[11px] text-[#DC2626] mt-1">{errors[field.id]}</p>
                  )}
                </>
              )}
            </div>
          );
        })}
        <button
          type="submit"
          disabled={disabled}
          className="
            mt-1 w-full py-3 rounded-full bg-[#FFAA00] text-[#1C1F2A]
            text-[14px] font-bold hover:bg-[#E69900]
            transition-all duration-150
            disabled:opacity-50 disabled:pointer-events-none
            focus:outline-none focus:ring-2 focus:ring-[#FFAA00]/40
            min-h-[44px]
          "
        >
          {submitLabel}
        </button>
      </form>
    </div>
  );
}

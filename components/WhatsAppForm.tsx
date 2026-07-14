"use client";
import { useState } from "react";
import { isValidEmail } from "@/lib/validation";

interface Field {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  options?: string[];
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

  function validate() {
    const errs: Record<string, string> = {};
    fields.forEach((f) => {
      if (!values[f.id]?.trim()) errs[f.id] = "Campo requerido";
      if (f.type === "email" && values[f.id] && !isValidEmail(values[f.id])) {
        errs[f.id] = "Ingresa un correo válido";
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
        {fields.map((field) => (
          <div key={field.id}>
            <label className="text-[12px] font-semibold text-[#424552] block mb-1">
              {field.label}
            </label>
            {field.type === "select" ? (
              <select
                value={values[field.id]}
                onChange={(e) => {
                  setValues({ ...values, [field.id]: e.target.value });
                  setErrors({ ...errors, [field.id]: "" });
                }}
                disabled={disabled}
                className="
                  w-full border border-[#CCCDD1] rounded-lg px-3 py-2.5
                  text-[13px] text-[#1C1F2A] bg-white appearance-none
                  focus:outline-none focus:border-[#FFAA00] focus:ring-2 focus:ring-[#FFAA00]/20
                  disabled:opacity-50
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
                value={values[field.id]}
                onChange={(e) => {
                  setValues({ ...values, [field.id]: e.target.value });
                  setErrors({ ...errors, [field.id]: "" });
                }}
                disabled={disabled}
                className="
                  w-full border border-[#CCCDD1] rounded-lg px-3 py-2.5
                  text-[13px] text-[#1C1F2A] placeholder:text-[#9898A2]
                  focus:outline-none focus:border-[#FFAA00] focus:ring-2 focus:ring-[#FFAA00]/20
                  disabled:opacity-50
                "
              />
            )}
            {errors[field.id] && (
              <p className="text-[11px] text-[#DC2626] mt-1">{errors[field.id]}</p>
            )}
          </div>
        ))}
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

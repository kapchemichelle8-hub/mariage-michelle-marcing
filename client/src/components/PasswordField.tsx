import { Eye, EyeOff, KeyRound } from "lucide-react";
import type { ChangeEvent } from "react";
import { useState } from "react";

interface PasswordFieldProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoFocus?: boolean;
  label: string;
}

/** Champ simple et réutilisable pour afficher ou masquer un mot de passe. */
export default function PasswordField({
  value,
  onChange,
  placeholder = "Mot de passe",
  autoFocus = false,
  label,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <KeyRound
        className="w-4 h-4 text-[#9d7537] absolute left-3 top-1/2 -translate-y-1/2"
        aria-hidden="true"
      />
      <input
        type={visible ? "text" : "password"}
        autoFocus={autoFocus}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={label}
        className="w-full pl-10 pr-24 py-3 rounded-xl border border-[#ebdcc8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#c69a58]"
      />
      <button
        type="button"
        onClick={() => setVisible(current => !current)}
        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#855f24] hover:bg-[#f4ede1]"
        aria-pressed={visible}
        aria-label={`${visible ? "Masquer" : "Afficher"} le mot de passe`}
        title={`${visible ? "Masquer" : "Afficher"} le mot de passe`}
      >
        {visible ? (
          <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
        ) : (
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
        )}
        {visible ? "Masquer" : "Afficher"}
      </button>
    </div>
  );
}

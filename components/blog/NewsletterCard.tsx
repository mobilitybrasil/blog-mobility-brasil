"use client";

import { useEffect, useId, useRef, useState } from "react";

const EMAIL_REGEX = /@.*\.[A-Za-z]/;

type Status = "idle" | "submitting" | "ok" | "error";

interface NewsletterCardProps {
  /** URL da política de privacidade exibida no rodapé do card. */
  privacyUrl?: string;
}

/**
 * Card de inscrição na newsletter usado na sidebar do post.
 *
 * Compartilha o endpoint `/api/newsletter` com o formulário do Footer —
 * por ora a integração de destino vive em `lib/uappi.ts` e pode ser
 * substituída por um endpoint dedicado do WordPress no futuro.
 */
export function NewsletterCard({ privacyUrl = "#" }: NewsletterCardProps = {}) {
  const emailInputId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [invalid, setInvalid] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  function scheduleReset() {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setStatus("idle"), 5000);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const value = email.trim();
    if (!EMAIL_REGEX.test(value)) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setStatus("submitting");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        sucesso?: boolean;
      };
      if (response.ok && data.sucesso) {
        setStatus("ok");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      scheduleReset();
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-[8px] bg-[#5e5e5e] px-2.5 py-[17px]">
      <div className="flex flex-col gap-3">
        <p className="font-display text-[20px] font-medium tracking-[2px] text-white">
          Newsletter
        </p>
        <div className="h-px w-full bg-white/40" />
      </div>

      <div className="flex flex-col gap-2.5">
        <p className="text-[12px] leading-[1.4] tracking-[0.6px] text-white">
          Cadastre-se e receba nossas atualizações direto no seu e-mail.
        </p>

        <form
          onSubmit={handleSubmit}
          aria-label="Inscrever-se na newsletter"
          className={`flex items-center justify-between gap-2 rounded-[4px] border-b bg-white px-3 py-2.5 transition-colors ${
            invalid
              ? "border-red-500 shadow-[0_0_5px_rgba(255,0,0,0.3)]"
              : "border-[#e7e7e7]"
          }`}
        >
          <label htmlFor={emailInputId} className="sr-only">
            E-mail
          </label>
          <input
            id={emailInputId}
            type="email"
            placeholder="E-mail"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (invalid) setInvalid(false);
              if (status !== "idle" && status !== "submitting") {
                setStatus("idle");
                if (resetTimer.current) clearTimeout(resetTimer.current);
              }
            }}
            disabled={status === "submitting"}
            className="min-w-0 flex-1 bg-transparent text-[14px] tracking-[0.28px] text-black placeholder:text-black/60 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === "submitting" || status === "ok"}
            className="shrink-0 text-[14px] font-semibold tracking-[0.28px] text-black underline disabled:no-underline"
          >
            {status === "idle" && "Inscrever-se"}
            {status === "submitting" && "Enviando..."}
            {status === "ok" && "Inscrito ✓"}
            {status === "error" && "Tentar de novo"}
          </button>
        </form>

        <p className="text-[12px] leading-[1.4] tracking-[0.6px] text-white">
          Ao inscrever-se, você concorda com a nossa{" "}
          <a href={privacyUrl} className="underline">
            política de privacidade.
          </a>
        </p>
      </div>
    </div>
  );
}

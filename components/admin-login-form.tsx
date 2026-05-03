"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ZazzoLogo } from "@/components/zazzo-logo";

export function AdminLoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "admin@zazzo.local",
    password: "admin12345"
  });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
      setMessage(data.message ?? "Login failed");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="panel mx-auto max-w-lg p-8">
      <ZazzoLogo compact />
      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.28em] text-coral">
        ZAZZO Admin
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink">
        Login to manage the store
      </h1>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        Default login is prefilled for local development. Change
        `ADMIN_EMAIL` and `ADMIN_PASSWORD` later for real deployment.
      </p>
      <div className="mt-8 grid gap-5">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Email
          <input
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
        {message ? <p className="text-sm text-coral">{message}</p> : null}
      </div>
    </form>
  );
}

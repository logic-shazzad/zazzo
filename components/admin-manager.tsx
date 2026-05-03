"use client";

import { FormEvent, useState } from "react";
import { ModeratorUser } from "@/lib/types";

type AdminManagerProps = {
  owner: {
    email: string;
    password: string;
  };
  initialModerators: ModeratorUser[];
};

export function AdminManager({
  owner,
  initialModerators
}: AdminManagerProps) {
  const [moderators, setModerators] = useState(initialModerators);
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const response = await fetch("/api/admin/moderators", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = (await response.json()) as {
      moderator?: ModeratorUser;
      message?: string;
    };

    if (!response.ok || !data.moderator) {
      setMessage(data.message ?? "Unable to create moderator.");
      setSaving(false);
      return;
    }

    const moderator = data.moderator;
    setModerators((current) =>
      [...current, moderator].sort((a, b) => a.email.localeCompare(b.email))
    );
    setForm({
      email: "",
      password: ""
    });
    setMessage("Moderator added successfully.");
    setSaving(false);
  }

  async function handleDelete(id: string) {
    setMessage(null);

    const response = await fetch("/api/admin/moderators", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });

    const data = (await response.json()) as {
      removedId?: string;
      message?: string;
    };

    if (!response.ok || !data.removedId) {
      setMessage(data.message ?? "Unable to remove moderator.");
      return;
    }

    setModerators((current) =>
      current.filter((moderator) => moderator.id !== data.removedId)
    );
    setMessage("Moderator removed successfully.");
  }

  return (
    <div className="grid gap-6">
      <section className="panel p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">
          Admin Manager
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">
          Keep owner access locked and add moderators safely
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
          The owner credentials stay fixed and cannot be edited here. Use this
          section only to add or remove moderator accounts for store management.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="panel p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">
                Fixed Owner
              </p>
              <h3 className="mt-2 text-xl font-semibold text-ink">Primary owner account</h3>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Locked
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Owner Email
              <input
                value={owner.email}
                readOnly
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Owner Password
              <input
                value={owner.password}
                readOnly
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600 outline-none"
              />
            </label>
          </div>

          <div className="mt-4 rounded-[22px] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            This owner account is permanent and cannot be updated or removed
            from the admin panel.
          </div>
        </section>

        <section className="panel p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">
            Add Moderator
          </p>
          <h3 className="mt-2 text-xl font-semibold text-ink">
            Create a moderator with email and password
          </h3>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Moderator Email
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value
                  }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
                placeholder="moderator@zazzo.com"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Moderator Password
              <input
                type="text"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    password: event.target.value
                  }))
                }
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
                placeholder="Set moderator password"
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              className="mt-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Adding..." : "Add Moderator"}
            </button>
            {message ? <p className="text-sm text-pine">{message}</p> : null}
          </form>
        </section>
      </div>

      <section className="panel p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">
              Moderator Accounts
            </p>
            <h3 className="mt-2 text-xl font-semibold text-ink">
              Manage moderator access without touching owner credentials
            </h3>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {moderators.length} active
          </span>
        </div>

        {moderators.length ? (
          <div className="mt-6 space-y-4">
            {moderators.map((moderator) => (
              <div
                key={moderator.id}
                className="flex flex-col gap-4 rounded-[24px] border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-base font-semibold text-ink">{moderator.email}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Password: {moderator.password}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                    Added {new Date(moderator.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(moderator.id)}
                  className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 p-5 text-sm text-slate-500">
            No moderators have been added yet. The owner account stays active as
            the permanent primary login.
          </div>
        )}
      </section>
    </div>
  );
}

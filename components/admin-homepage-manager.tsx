"use client";

import { FormEvent, useState } from "react";
import { HomepageCollectionCard } from "@/lib/types";

type AdminHomepageManagerProps = {
  initialCards: HomepageCollectionCard[];
  initialHeroDescription: string;
};

export function AdminHomepageManager({
  initialCards,
  initialHeroDescription
}: AdminHomepageManagerProps) {
  const [cards, setCards] = useState(initialCards);
  const [heroDescription, setHeroDescription] = useState(initialHeroDescription);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function updateCard(
    index: number,
    key: keyof HomepageCollectionCard,
    value: string
  ) {
    setCards((current) =>
      current.map((card, currentIndex) =>
        currentIndex === index ? { ...card, [key]: value } : card
      )
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const response = await fetch("/api/homepage-collections", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cards, heroDescription })
    });

    const data = (await response.json()) as {
      cards?: HomepageCollectionCard[];
      heroDescription?: string;
      message?: string;
    };

    if (!response.ok || !data.cards || !data.heroDescription) {
      setMessage(data.message ?? "Unable to update homepage content.");
      setSaving(false);
      return;
    }

    setCards(data.cards);
    setHeroDescription(data.heroDescription);
    setSaving(false);
    setMessage("Homepage hero text and collection cards updated.");
  }

  return (
    <div className="panel p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-coral">
        Homepage Cards
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">
        Edit the three collection cards shown on the customer homepage
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
        Change the hero description and collection card content from one place.
        These updates appear instantly on the public homepage.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
        <section className="rounded-[28px] border border-slate-200 p-5">
          <p className="text-sm font-semibold text-ink">Hero Description</p>
          <p className="mt-1 text-xs text-slate-500">
            This text appears below the main hero headline on the homepage.
          </p>
          <label className="mt-4 grid gap-2 text-sm font-medium text-slate-700">
            Description
            <textarea
              rows={4}
              value={heroDescription}
              onChange={(event) => setHeroDescription(event.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
            />
          </label>
        </section>

        {cards.map((card, index) => (
          <section key={card.id} className="rounded-[28px] border border-slate-200 p-5">
            <div className="mb-4">
              <p className="text-sm font-semibold text-ink">Card {index + 1}</p>
              <p className="text-xs text-slate-500">Shown in the homepage collections section.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Eyebrow
                <input
                  value={card.eyebrow}
                  onChange={(event) => updateCard(index, "eyebrow", event.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Title
                <input
                  value={card.title}
                  onChange={(event) => updateCard(index, "title", event.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
                />
              </label>
            </div>

            <label className="mt-4 grid gap-2 text-sm font-medium text-slate-700">
              Description
              <textarea
                rows={4}
                value={card.description}
                onChange={(event) => updateCard(index, "description", event.target.value)}
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-pine"
              />
            </label>
          </section>
        ))}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving..." : "Update Homepage Content"}
          </button>
          {message ? <p className="text-sm text-pine">{message}</p> : null}
        </div>
      </form>
    </div>
  );
}

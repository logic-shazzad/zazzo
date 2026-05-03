"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({
  images,
  name,
  accent
}: {
  images: string[];
  name: string;
  accent: string;
}) {
  const [selected, setSelected] = useState(0);

  return (
    <div className={`rounded-[32px] bg-gradient-to-br ${accent} p-6`}>
      <div className="relative h-[520px] overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_70px_rgba(31,41,51,0.12)]">
        <Image
          src={images[selected]}
          alt={name}
          fill
          className="object-cover object-center transition duration-500"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setSelected(index)}
            className={`relative h-24 overflow-hidden rounded-2xl border ${
              selected === index ? "border-pine" : "border-white/60"
            } bg-white/90 shadow-sm`}
          >
            <Image
              src={image}
              alt={`${name} preview ${index + 1}`}
              fill
              className="object-cover object-center"
              sizes="120px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

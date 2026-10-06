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
    <div className={`min-w-0 rounded-[24px] bg-gradient-to-br ${accent} p-3 sm:rounded-[32px] sm:p-6`}>
      <div className="relative h-[300px] overflow-hidden rounded-[20px] border border-white/70 bg-white/85 shadow-[0_24px_70px_rgba(31,41,51,0.12)] sm:h-[520px] sm:rounded-[28px]">
        <Image
          src={images[selected]}
          alt={name}
          fill
          className="object-cover object-center transition duration-500"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setSelected(index)}
            className={`relative h-20 overflow-hidden rounded-xl border sm:h-24 sm:rounded-2xl ${
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

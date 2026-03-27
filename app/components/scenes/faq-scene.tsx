"use client";

import { useState } from "react";
import { faqs } from "@/app/data/faqs";

export default function FaqScene() {
  const [openId, setOpenId] = useState<number>(4);

  return (
    <section className="mx-auto min-h-[78vh] max-w-4xl">
      <div className="mb-10">
        <span className="omnes-text inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1 text-sm text-white/75 backdrop-blur">
          FAQ
        </span>

        <h2 className="omnes-title mt-5 text-5xl leading-[0.92] tracking-[-0.04em] sm:text-6xl">
          Everything
          <span className="block text-white/75">you may ask.</span>
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((item) => {
          const isOpen = openId === item.id;

          return (
            <div
              key={item.id}
              className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 backdrop-blur"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? 0 : item.id)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span className="omnes-title text-2xl leading-tight text-white">
                  {item.question}
                </span>

                <span className="omnes-text text-xl text-white/60">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <p className="omnes-text mt-4 max-w-3xl text-lg leading-8 text-white/70">
                  {item.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
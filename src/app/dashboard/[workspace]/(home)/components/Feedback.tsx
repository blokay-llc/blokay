"use client";
import { DS } from "@blokay/react";

export default async function Feedback() {
  return (
    <div className="border border-neutral-300 bg-neutral-50 rounded-lg p-5">
      <h2 className="text-xl font-bold text-neutral-800 mb-3">Feedback</h2>
      <p className="text-neutral-500 dark:text-neutral-400 font-light text-sm mb-3">
        We would love to hear your thoughts on how we can improve our product.
        Your feedback helps us make our product better.
      </p>
      <DS.Button
        text="Give us feedback"
        icon="share"
        variant="secondary"
        size="md"
      />
    </div>
  );
}

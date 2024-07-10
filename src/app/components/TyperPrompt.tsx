"use client";

import { DS } from "@blokay/react";

export default function TyperPrompt({
  loading,
  onChange,
  value,
  onGenerate,
}: any) {
  return (
    <div className="bg-neutral-100 dark:bg-neutral-800 p-2 mt-6 rounded-xl overflow-hidde items-center  bottom-0 relative  flex justify-between mx-auto">
      <textarea
        className="font-light bg-neutral-100 dark:bg-neutral-800  dark:text-neutral-200  text-slate-900 w-full min-h-6 focus:outline-none px-5 py-0 dark:placeholder-neutral-600"
        placeholder="Write your requirement here"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        onInput={(e: any) => {
          e.target.style.height = "auto";
          e.target.style.height = e.target.scrollHeight + "px";
        }}
      ></textarea>
      <div>
        <DS.Button
          icon="wizard"
          text="Generate"
          onClick={onGenerate}
          variant="secondary"
          size="md"
          loading={loading}
        />
      </div>
    </div>
  );
}

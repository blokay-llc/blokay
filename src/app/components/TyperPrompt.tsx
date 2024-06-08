"use client";

import { DS } from "@blokay/react";

export default function TyperPrompt({
  loading,
  onChange,
  value,
  onGenerate,
}: any) {
  return (
    <div className="bg-neutral-200 dark:bg-neutral-800 p-2 mt-6 rounded-3xl overflow-hidde items-center  bottom-0 relative  flex justify-between mx-auto">
      <textarea
        className="font-light bg-neutral-200 dark:bg-neutral-800  dark:text-neutral-200 rounded-2xl text-slate-900 w-full min-h-6 focus:outline-none px-5 py-0 dark:placeholder-neutral-600"
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
        <button
          onClick={onGenerate}
          className="font-medium text-sm right-5 bg-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-900 hover:bg-neutral-700 text-white  px-3 py-2 rounded-lg flex gap-3 items-center"
        >
          {loading && <DS.Loader size="sm" />}
          {!loading && <DS.Icon icon="wizard" className="fill-white size-5" />}
          <div>Generate</div>
        </button>
      </div>
    </div>
  );
}

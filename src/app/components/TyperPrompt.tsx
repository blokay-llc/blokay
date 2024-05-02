"use client";

import { AppLoader } from "./DS/Index";

export default function TyperPrompt({
  loading,
  onChange,
  value,
  onGenerate,
}: any) {
  return (
    <div className="bg-slate-200 p-2 mt-6 rounded-3xl overflow-hidde   bottom-0 relative  flex justify-between mx-auto">
      <textarea
        className="font-light bg-slate-200 rounded-2xl text-slate-900 w-full min-h-6 focus:outline-none px-5 py-0 "
        placeholder="Escribir requerimiento aqui"
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
          className="font-semibold text-sm right-5 bg-stone-600 hover:bg-stone-700 text-white  px-5 py-2 rounded-xl flex gap-3 items-center"
        >
          {loading && <AppLoader size="sm" />}
          {!loading && (
            <svg className="fill-white size-5" viewBox="0 0 24 24">
              <path d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25z"></path>
            </svg>
          )}
          <div>Generate</div>
        </button>
      </div>
    </div>
  );
}

"use client";
import { AppInput } from "@/app/components/DS/Index";
import { useState } from "react";

export default function EditItemOptions({ type, options }: any) {
  const [form, setForm] = useState({ ...options });
  return (
    <div
      className="flex gap-2 flex-col"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {type == "text" && (
        <>
          <AppInput
            type="text"
            value={form.text}
            onChange={(val: string) => {
              setForm({ ...form, text: val });
            }}
            label={"Text"}
          />
        </>
      )}

      {type == "image" && (
        <>
          <AppInput
            type="text"
            value={form.image}
            onChange={(val: string) => {
              setForm({ ...form, image: val });
            }}
            label={"URL image"}
          />
        </>
      )}

      {type == "button" && (
        <>
          <AppInput
            type="text"
            value={form.label}
            //   error={errors[row.name]}
            onChange={(val: string) => {
              setForm({ ...form, label: val });
            }}
            label={"Button label"}
          />
          <AppInput
            type="text"
            value={form.label}
            //   error={errors[row.name]}
            onChange={(val: string) => {
              setForm({ ...form, label: val });
            }}
            label={"Button onClick"}
          />
        </>
      )}
    </div>
  );
}

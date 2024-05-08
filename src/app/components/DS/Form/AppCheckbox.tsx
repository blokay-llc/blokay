"use client";
import React from "react";
import { AppIcon } from "../Index";
import "./form.css";

export default function AppCheckbox({
  label,
  value,
  placeholder,
  ...extraProps
}: any) {
  return (
    <div className=" ">
      <label className="rounded-lg bg-gray-50 border-2 border-gray-100 px-2 items-center py-1 flex gap-2  select-none dark:bg-stone-900 dark:border-stone-900">
        <input
          type="checkbox"
          onChange={(e) => {
            extraProps.onChange && extraProps.onChange(!value);
          }}
          value={value == true ? "true" : undefined}
          className="hidden"
        />
        <div
          className="size-6 rounded-lg border-2 border-gray-200 dark:border-stone-600"
          style={{ flexShrink: 0 }}
        >
          {value && (
            <AppIcon
              icon="check"
              className="fill-stone-900 dark:fill-stone-200"
            />
          )}
        </div>
        <div className="text-sm font-light text-stone-600 dark:text-stone-300">
          {label || extraProps.children}
        </div>
      </label>
    </div>
  );
}

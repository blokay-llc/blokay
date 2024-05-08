"use client";
import React, { useState } from "react";
import { AppIcon } from "../Index";
import "./form.css";

function genRandomString(length: number): string {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charLength = chars.length;
  var result = "";
  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
}

export default function AppInput({
  label,
  value,
  placeholder = null,
  icon = null,
  error = null,
  ...extraProps
}: any) {
  const [activeLabel, setActiveLabel] = useState(false);
  const [id] = useState(genRandomString(10));

  return (
    <div className="w-full">
      <div className="relative ">
        {icon && (
          <AppIcon
            className={`size-6 ${
              error ? "fill-red-400" : "fill-gray-400"
            } absolute bottom-2.5 right-4`}
            icon={icon}
          />
        )}

        <label
          onClick={() => {
            let el = document.getElementById(id);
            if (el) el.focus();
          }}
          htmlFor={id}
          className={` select-none absolute  text-stone-500 dark:text-stone-400 ${
            activeLabel || value || extraProps.type === "date"
              ? " top-2 text-xs left-5 font-medium"
              : " top-3 pt-0.5 left-5 font-light text-stone-600 dark:text-stone-500 "
          }`}
          style={{ transitionDuration: "0.3s" }}
        >
          {label}
        </label>
        <div>
          <input
            {...extraProps}
            id={id}
            onChange={(e) => {
              extraProps.onChange && extraProps.onChange(e.target.value);
            }}
            onBlur={() => {
              setActiveLabel(false);
              extraProps.onBlur && extraProps.onBlur();
            }}
            onFocus={() => {
              setActiveLabel(true);
              extraProps.onFocus && extraProps.onFocus();
            }}
            value={value || ""}
            className={`app-input appearance-none   ${error ? "error" : ""} ${
              extraProps.className
            } `}
            type={extraProps.type}
          />
        </div>
      </div>
      {error && <div className="text-left text-red-500 text-sm">{error}</div>}
    </div>
  );
}

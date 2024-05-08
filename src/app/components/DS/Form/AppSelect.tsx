"use client";
import React from "react";
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

export default function AppSelect({
  label,
  value,
  placeholder,
  children,
  error = null,
  ...extraProps
}: any) {
  const id = genRandomString(10);

  return (
    <div className="relative ">
      <label
        htmlFor={id}
        className={` absolute left-4 appearance-none	 text-stone-600 dark:text-stone-500 
          top-2 text-xs font-light`}
        style={{ transitionDuration: "0.3s" }}
      >
        {label}
      </label>
      <div>
        <select
          {...extraProps}
          id={id}
          onChange={(e) => {
            extraProps.onChange && extraProps.onChange(e.target.value);
          }}
          onBlur={() => {
            extraProps.onBlur && extraProps.onBlur();
          }}
          onFocus={() => {
            extraProps.onFocus && extraProps.onFocus();
          }}
          value={value}
          className={` app-input ${error ? "error" : ""}  ${
            extraProps.className
          }`}
          type="text"
          placeholder={placeholder}
        >
          {children}
        </select>

        {error && <div className="text-left text-red-500 text-sm">{error}</div>}
      </div>
    </div>
  );
}

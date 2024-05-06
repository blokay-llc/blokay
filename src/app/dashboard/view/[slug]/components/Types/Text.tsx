"use client";
export default function ({ options, editMode }: any) {
  return <p className="font-light">{options.text || "Your text here"}</p>;
}

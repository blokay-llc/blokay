"use client";
import { useRef } from "react";
import { DS, Events } from "@blokay/react";
export default function ({ options, editMode }: any) {
  const eventRef: any = useRef();
  return (
    <>
      <DS.Button
        text={options?.label || "Button"}
        className="w-full"
        variant="primary"
        onClick={() => {
          if (editMode != "user") return;
          eventRef.current.functions[options.click]({
            form: {},
            ...options,
          });
        }}
      />

      {editMode == "user" && <Events ref={eventRef} />}
    </>
  );
}

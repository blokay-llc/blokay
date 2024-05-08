"use client";
import { useRef } from "react";
import Events from "@/app/components/Brain/Events";
import { AppButton } from "@/app/components/DS/Index";
export default function ({ options, editMode }: any) {
  const eventRef: any = useRef();
  return (
    <>
      <AppButton
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

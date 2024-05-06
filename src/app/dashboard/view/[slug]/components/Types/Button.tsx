"use client";
import { AppButton } from "@/app/components/DS/Index";
export default function ({ options }: any) {
  return (
    <AppButton
      text={options?.label || "Button"}
      className="w-full"
      variant="primary"
    />
  );
}

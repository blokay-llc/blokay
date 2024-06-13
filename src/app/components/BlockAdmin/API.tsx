"use client";

import APIDoc from "./APIDoc";

export default function API({ reload, block }: any) {
  if (!block) return <></>;

  return <APIDoc block={block} />;
}

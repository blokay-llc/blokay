"use client";

import APIDoc from "./APIDoc";

export default function API({ reload, neuron }: any) {
  if (!neuron) return <></>;

  return <APIDoc neuron={neuron} />;
}

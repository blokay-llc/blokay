"use client";

import NeuronAPIDoc from "./NeuronAPIDoc";

export default function NeuronAPI({ reload, neuron }: any) {
  if (!neuron) return <></>;

  return <NeuronAPIDoc neuron={neuron} />;
}

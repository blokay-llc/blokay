"use client";
import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { AppModal } from "../DS/Index";
import Neuron from "./Neuron";

function EventsHandler({ onExecuted }: any, ref: any) {
  const subneuronDefault: any = {
    neuronId: null,
    neuronKey: "",
    form: {},
  };
  const [subneuron, setSubneuron] = useState(subneuronDefault);
  const modalRef: any = useRef();

  const functions: any = {
    openNeuron: ({
      neuronId,
      neuronKey,
      form,
    }: {
      neuronId: number;
      neuronKey: string;
      form: any;
    }) => {
      setSubneuron({ neuronId, neuronKey, form });
      modalRef.current.showModal();
    },
  };

  useImperativeHandle(ref, () => ({
    functions,
  }));

  return (
    <>
      <AppModal size="lg" position="center" ref={modalRef}>
        {(subneuron.neuronKey || subneuron.neuronId) && (
          <Neuron
            neuronId={subneuron.neuronId}
            neuronKey={subneuron.neuronKey}
            defaultForm={subneuron.form}
            onExec={(result: any) => {
              if (
                !result.type ||
                result.type == "error" ||
                result.type == "message"
              ) {
                modalRef.current.hideModal();
                onExecuted && onExecuted();
              }
            }}
          />
        )}
      </AppModal>
    </>
  );
}

const Events = forwardRef(EventsHandler);

export default Events;

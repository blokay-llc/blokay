"use client";
import { useRef } from "react";
import { AppModal, AppButton } from "@/app/components/DS/Index";

const NeuronEdit = ({
  neuronId,
  neuron,
  deleteFromLayout = null,
  onEditNeuron = null,
}: any) => {
  const modalDeleteRef: any = useRef();

  return (
    <div className="flex mt-2 gap-1 justify-end select-none absolute top-3 right-3 z-20">
      {neuron?.id && (
        <div
          className="px-3 py-1 cursor-pointer rounded-lg hover:bg-stone-100 bg-white shadow-sm flex gap-3 items-center text-stone-500 text-sm border-2 border-stone-200"
          onMouseDown={(e) => {
            e.stopPropagation();
            onEditNeuron && onEditNeuron(neuron);
          }}
        >
          <svg className="fill-stone-500 size-5" viewBox="0 0 24 24">
            <path d="M7.5 5.6 10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29a.9959.9959 0 0 0-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41zm-1.03 5.49-2.12-2.12 2.44-2.44 2.12 2.12z"></path>
          </svg>
          <span>Edit</span>
        </div>
      )}

      <div
        className="px-3 py-1 cursor-pointer rounded-lg hover:bg-stone-100 bg-white shadow-sm flex gap-3 items-center text-stone-500 text-sm border-2 border-stone-200"
        onMouseDown={(e) => {
          e.stopPropagation();
          modalDeleteRef.current.showModal();
        }}
      >
        <svg className="fill-stone-500 size-5" viewBox="0 0 24 24">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"></path>
        </svg>
      </div>

      <AppModal
        title="Delete from this view"
        footer={
          <div className="flex items-center gap-5">
            <AppButton
              text="No, cancel"
              onClick={() => modalDeleteRef.current.hideModal()}
              variant="secondary"
              className="w-full"
              size="md"
            />
            <AppButton
              text="Yes, delete"
              onClick={() => {
                modalDeleteRef.current.hideModal();
                deleteFromLayout(neuronId);
              }}
              variant="primary"
              className="w-full"
              size="md"
            />
          </div>
        }
        size="sm"
        ref={modalDeleteRef}
      >
        <p className="font-light text-stone-900">
          This action is irreversible. Are you sure you want to proceed?
        </p>
      </AppModal>
    </div>
  );
};
export default NeuronEdit;

"use client";
import { AppModal, AppButton, AppIcon } from "@/app/components/DS/Index";
import { useRef } from "react";

export default function ({
  deleteFromLayout,
  clickNeuron,
  viewItem,
  setViewItem,
}: any) {
  const modalDeleteRef: any = useRef();

  return (
    <div>
      <div className="flex mt-2 gap-1 justify-end select-none absolute top-3 right-3 z-20">
        {viewItem.neuronId && (
          <div
            className="px-3 py-1 cursor-pointer rounded-lg hover:bg-stone-100 bg-white shadow-sm flex gap-3 items-center text-stone-500 text-sm border-2 border-stone-200"
            onMouseDown={(e) => {
              e.stopPropagation();
              clickNeuron(viewItem.neuronId);
            }}
          >
            <AppIcon icon="edit" className="fill-stone-500 size-5" />
            <span>Edit</span>
          </div>
        )}

        <div
          className="px-3 py-1 cursor-pointer rounded-lg hover:bg-stone-100 bg-white shadow-sm flex gap-3 items-center text-stone-500 text-sm border-2 border-stone-200"
          onMouseDown={(e) => {
            e.stopPropagation();
            setViewItem(viewItem);
            modalDeleteRef.current.showModal();
          }}
        >
          <AppIcon icon="delete" className="fill-stone-500 size-5" />
        </div>
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
                deleteFromLayout(viewItem?.id);
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
}

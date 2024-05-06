"use client";
import { AppModal, AppButton, AppIcon } from "@/app/components/DS/Index";
import { useRef } from "react";
import EditItemOptions from "./Types/EditItemOptions";

export default function ({
  deleteFromLayout,
  clickNeuron,
  viewItem,
  setViewItem,
}: any) {
  const modalDeleteRef: any = useRef();
  const modalOptionsItem: any = useRef();

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="absolute top-2 right-3 z-20">
        <div className="opacity-0 group-hover:opacity-100 transition duration-100 flex  gap-1 justify-end select-none ">
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

          {!viewItem.neuronId && (
            <div
              className="px-3 py-1 cursor-pointer rounded-lg hover:bg-stone-100 bg-white shadow-sm flex gap-3 items-center text-stone-500 text-sm border-2 border-stone-200"
              onMouseDown={(e) => {
                e.stopPropagation();
                setViewItem(viewItem);
                modalOptionsItem.current.showModal();
              }}
            >
              <AppIcon icon="edit" className="fill-stone-500 size-5" />
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
      </div>

      <AppModal
        title="Edit options of the item"
        footer={
          <div className="flex items-center gap-5">
            <AppButton
              text="Cancel"
              onClick={() => modalOptionsItem.current.hideModal()}
              variant="secondary"
              className="w-full"
              size="md"
            />
            <AppButton
              text="Update"
              onClick={() => {
                modalOptionsItem.current.hideModal();
                // deleteFromLayout(viewItem?.id);
              }}
              variant="primary"
              className="w-full"
              size="md"
            />
          </div>
        }
        size="sm"
        ref={modalOptionsItem}
      >
        <EditItemOptions type={viewItem.type} options={viewItem.options} />
      </AppModal>

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

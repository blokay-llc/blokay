"use client";
import { useRef, forwardRef } from "react";
import { AppModal, AppButton } from "@/app/components/DS/Index";
import React, { useImperativeHandle } from "react";
import EditItemOptions from "./EditItemOptions";

function ActionsEdit(
  { view, deleteFromLayout, viewItem, reload }: any,
  ref: any
) {
  const modalDeleteRef: any = useRef();
  const modalOptionsItem: any = useRef();

  const edit = (e: any) => {
    e.stopPropagation();
    modalOptionsItem.current.showModal();
  };

  const deleteFromView = (e: any) => {
    e.stopPropagation();
    modalDeleteRef.current.showModal();
  };

  useImperativeHandle(ref, () => ({
    edit,
    deleteFromView,
  }));

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <AppModal
        title="Edit options of the item"
        size="sm"
        ref={modalOptionsItem}
      >
        <EditItemOptions
          viewId={view?.id}
          id={viewItem?.id}
          type={viewItem?.type}
          options={viewItem?.options}
          onHide={() => {
            modalOptionsItem.current.hideModal();
          }}
          onUpdate={() => {
            modalOptionsItem.current.hideModal();
            reload();
          }}
        />
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
        <p className="font-light ">
          This action is irreversible. Are you sure you want to proceed?
        </p>
      </AppModal>
    </div>
  );
}

export default forwardRef(ActionsEdit);

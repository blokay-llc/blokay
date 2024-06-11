"use client";
import { DS } from "@blokay/react";

export default function ({
  clickNeuron,
  viewItem,
  setViewItem,
  onAction,
}: any) {
  const setAction = (e: any, action: string) => {
    onAction && onAction(e, action);
    setViewItem(viewItem);
  };
  return (
    <div>
      {viewItem.block && (
        <div className="bg-blue-400 group-hover:opacity-100 opacity-0 absolute text-sm -top-5 -left-[2px] text-blue-900 px-2">
          {viewItem.block}
        </div>
      )}

      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="absolute top-2 right-3 z-20">
          <div className="opacity-0 group-hover:opacity-100 transition duration-100 flex  gap-1 justify-end select-none ">
            {viewItem.neuronId && (
              <div
                className="action-button"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setViewItem(viewItem);
                  clickNeuron(viewItem.neuronId);
                }}
              >
                <DS.Icon icon="edit" />
                <span>Edit</span>
              </div>
            )}

            {!viewItem.neuronId && (
              <div
                className="action-button"
                onMouseDown={(e) => setAction(e, "edit")}
              >
                <DS.Icon icon="edit" />
              </div>
            )}

            <div
              className="action-button"
              onMouseDown={(e) => setAction(e, "delete")}
            >
              <DS.Icon icon="delete" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

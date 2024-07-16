"use client";
import { DS } from "@blokay/react";

type Props = {
  viewItem: any;
  functions: any;
};
export default function ({ viewItem, functions }: Props) {
  return (
    <div>
      {viewItem.block && (
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="bg-blue-400 group-hover:opacity-100 opacity-0 absolute text-sm -top-5 -left-[2px] text-blue-900 px-2 select-text selection:bg-blue-900 selection:text-blue-200"
        >
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
            {viewItem.blockId && (
              <div className="action-button" onMouseDown={functions.edit}>
                <DS.Icon icon="edit" />
                <span>Edit</span>
              </div>
            )}

            {!viewItem.blockId && (
              <div
                className="action-button"
                onMouseDown={functions.editOptions}
              >
                <DS.Icon icon="edit" />
              </div>
            )}

            <div className="action-button" onMouseDown={functions.delete}>
              <DS.Icon icon="delete" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

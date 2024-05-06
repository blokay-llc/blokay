"use client";
import { AppIcon } from "@/app/components/DS/Index";

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
                setViewItem(viewItem);
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
              onMouseDown={(e) => setAction(e, "edit")}
            >
              <AppIcon icon="edit" className="fill-stone-500 size-5" />
            </div>
          )}

          <div
            className="px-3 py-1 cursor-pointer rounded-lg hover:bg-stone-100 bg-white shadow-sm flex gap-3 items-center text-stone-500 text-sm border-2 border-stone-200"
            onMouseDown={(e) => setAction(e, "delete")}
          >
            <AppIcon icon="delete" className="fill-stone-500 size-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

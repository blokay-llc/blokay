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
              className="action-button"
              onMouseDown={(e) => {
                e.stopPropagation();
                setViewItem(viewItem);
                clickNeuron(viewItem.neuronId);
              }}
            >
              <AppIcon icon="edit" />
              <span>Edit</span>
            </div>
          )}

          {!viewItem.neuronId && (
            <div
              className="action-button"
              onMouseDown={(e) => setAction(e, "edit")}
            >
              <AppIcon icon="edit" />
            </div>
          )}

          <div
            className="action-button"
            onMouseDown={(e) => setAction(e, "delete")}
          >
            <AppIcon icon="delete" />
          </div>
        </div>
      </div>
    </div>
  );
}

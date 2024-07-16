import { useState, forwardRef } from "react";
import { DS, Block } from "@blokay/react";
import Image from "./Types/Image";
import Button from "./Types/Button";
import Text from "./Types/Text";
import ActionsEditButtons from "./ActionsEditButtons";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/app/components/UI/ContextMenu";

const ViewItem = forwardRef(
  (
    {
      style,
      className,
      onMouseDown,
      onMouseUp,
      onTouchEnd,
      children,
      vItem,
      editMode,
      setEditMode,
      clickBlock,
      actionsEditRef,
      isAdmin,
      setViewItem,
      setBlockView,
    }: any,
    ref: any
  ) => {
    const [seed, setSeed] = useState(1);
    const functions: any = {
      delete(e: any) {
        e.stopPropagation();
        actionsEditRef.current.deleteFromView(e);
        setEditMode("edit");
      },
      editOptions(e: any) {
        e.stopPropagation();
        actionsEditRef.current.editOptions(e);
        setEditMode("edit");
      },
      edit(e: any) {
        setBlockView("chat");
        e.stopPropagation();
        setViewItem(vItem);
        clickBlock(vItem.blockId);
        setEditMode("edit");
      },
      editAndOpenView: (v: string) => (e: any) => {
        setBlockView(v);
        e.stopPropagation();
        setViewItem(vItem);
        clickBlock(vItem.blockId);
        setEditMode("edit");
      },
      reload(e: any) {
        e.stopPropagation();
        setSeed(Math.random());
      },
    };
    return (
      <div
        style={{ ...style }}
        className={className}
        ref={ref}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      >
        <ContextMenu>
          <ContextMenuTrigger>
            {isAdmin && editMode === "edit" && (
              <ActionsEditButtons viewItem={vItem} functions={functions} />
            )}
            {vItem.type == "block" && (
              <div
                className={`dark:border-white/10 border-neutral-300 border rounded-xl  overflow-y-auto max-h-full h-full flex justify-center bg-neutral-100 dark:bg-transparent ${
                  editMode == "edit" ? "grayscale" : ""
                }`}
              >
                <Block key={seed} blockId={vItem.blockId} defaultForm={{}} />
              </div>
            )}
            {vItem.type == "button" && (
              <div className={`${editMode == "edit" ? "grayscale" : ""}`}>
                <Button editMode={editMode} options={vItem.options} />
              </div>
            )}
            {vItem.type == "image" && (
              <Image editMode={editMode} options={vItem.options} />
            )}
            {vItem.type == "text" && (
              <Text editMode={editMode} options={vItem.options} />
            )}
          </ContextMenuTrigger>
          {isAdmin && (
            <ContextMenuContent
              className="w-48 font-light "
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ContextMenuItem inset onClick={functions.reload}>
                Reload
              </ContextMenuItem>
              {vItem.blockId && (
                <ContextMenuItem
                  inset
                  onClick={functions.editAndOpenView("general")}
                >
                  Edit
                </ContextMenuItem>
              )}

              {!vItem.blockId && (
                <ContextMenuItem inset onClick={functions.editOptions}>
                  Edit options
                </ContextMenuItem>
              )}

              <ContextMenuItem
                inset
                onClick={functions.editAndOpenView("chat")}
              >
                Ask AI
                <DS.Icon
                  icon="wizard"
                  className="size-4 fill-neutral-500 ml-auto"
                />
              </ContextMenuItem>

              <ContextMenuItem
                inset
                onClick={functions.editAndOpenView("code")}
              >
                Code
              </ContextMenuItem>

              <ContextMenuSub>
                <ContextMenuSubTrigger inset>
                  Connect with
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-48 ">
                  <ContextMenuItem onClick={functions.editAndOpenView("api")}>
                    API
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={functions.editAndOpenView("api")}>
                    React
                  </ContextMenuItem>
                  <ContextMenuItem onClick={functions.editAndOpenView("api")}>
                    Vue
                  </ContextMenuItem>
                  <ContextMenuItem onClick={functions.editAndOpenView("api")}>
                    HTML
                  </ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>

              <ContextMenuItem
                inset
                onClick={functions.editAndOpenView("metrics")}
              >
                Analytics
              </ContextMenuItem>
              <ContextMenuItem inset onClick={functions.edit} disabled>
                History
              </ContextMenuItem>

              <ContextMenuSeparator />

              <ContextMenuItem inset onClick={functions.delete}>
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          )}
        </ContextMenu>

        {children}
      </div>
    );
  }
);

export default ViewItem;

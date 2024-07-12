"use client";
import { useState, useEffect, useRef } from "react";
import GridLayout from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import {
  viewGet,
  saveView as saveViewApi,
  saveLayout as saveLayoutApi,
  brainList,
  viewList,
  deleteFromLayout as deleteFromLayoutApi,
} from "@/app/services/brain";
import { DS, Block } from "@blokay/react";
import { useScreen } from "@/hooks/useScreen";
import Header from "@/app/dashboard/[workspace]/view/[slug]/components/Header";
import Menu from "@/app/components/Menu/Menu";
import BlockAdmin from "../../../../../components/BlockAdmin/Index";
import { useSession } from "next-auth/react";
import "./styles.css";
import { uuidv4 } from "@/app/helpers/functions";
import ActionsEdit from "./ActionsEdit";
import Image from "./Types/Image";
import Button from "./Types/Button";
import Text from "./Types/Text";
import ActionsEditButtons from "./ActionsEditButtons";
import { useRouter } from "next/navigation";

interface ViewBlockProps {
  slug: string;
  jwt: string;
  workspace: string;
}
const ViewBlock = ({ slug, jwt, workspace }: ViewBlockProps) => {
  const { data: session }: any = useSession();
  const isAdmin = session?.user?.rol == "admin";

  const router = useRouter();
  const actionsEditRef: any = useRef();
  const modalRef: any = useRef();
  const containerRef: any = useRef(null);
  const [view, setView]: any = useState(null);
  const [viewItem, setViewItem]: any = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [containerWidth, setContainerWidth] = useState(null);
  const [block, setBlock]: any = useState(null);
  const [editMode, setEditMode] = useState("user");
  const [views, setViews] = useState([]);
  const { rowHeight } = useScreen();

  const listViews = () => {
    viewList(workspace).then((result: any) => {
      setViews(result.Views);
    });
  };

  const fetchListBlocks = () => {
    brainList(workspace).then((l: any) => {
      setBlocks(l.Blocks);
    });
  };

  const fetchView = () => {
    viewGet(slug)
      .then((r) => {
        setView(r.View);
      })
      .catch((e) => {
        router.push("/dashboard");
      });
  };
  useEffect(() => {
    if (isAdmin && view?.ViewItems?.length == 0) {
      setEditMode("edit");
    }
  }, [view, isAdmin]);

  useEffect(() => {
    listViews();
    fetchView();
    fetchListBlocks();
  }, []);

  const saveView = (form: any) => {
    setView({
      ...view,
      ...form,
    });
    saveViewApi({
      viewId: view.id,
      ...form,
    });
  };

  useEffect(() => {
    const fetchData = setTimeout(() => {
      if (!view?.id) return;
      if (!view?.hasChanges) return;
      saveLayoutApi({
        viewId: view.id,
        layout: view.ViewItems,
      });
    }, 300);

    return () => clearTimeout(fetchData);
  }, [view?.ViewItems]);

  const saveLayout = (layout: any = []) => {
    let items = view?.ViewItems.slice(0);
    let hasChanges = false;
    for (let index in items) {
      let item = items[index];
      let lItem = layout.find((x: any) => item.id == x.i);
      // to add
      if (!lItem) {
        continue;
      }
      // update

      if (
        lItem.x != item.x ||
        lItem.y != item.y ||
        lItem.w != item.w ||
        lItem.h != item.h
      ) {
        hasChanges = true;
      }
      items[index] = {
        ...item,
        x: lItem.x,
        y: lItem.y,
        w: lItem.w,
        h: lItem.h,
      };
    }
    if (hasChanges) {
      setView({ ...view, hasChanges: true, ViewItems: items });
    }
  };

  const refreshView = () => {
    fetchView();
  };

  useEffect(() => {
    setContainerWidth(
      containerRef.current ? containerRef.current.offsetWidth : 0
    );
  }, [containerRef.current]);

  const addViewItem = ({ blockId = null, x, y, w, h, type }: any) => {
    const newLayout: any = [
      ...view.ViewItems,
      {
        x,
        y,
        w,
        h,
        type,
        blockId: blockId,
        id: uuidv4(),
      },
    ];
    setView({
      ...view,
      hasChanges: true,
      ViewItems: newLayout,
    });
  };

  const onDrop = (layout: any[], layoutItem: any, _event: any) => {
    let i = _event.dataTransfer.getData("text/plain");
    addViewItem({ ...layoutItem, type: "block", blockId: i });
  };

  const clickBlock = (blockId: any) => {
    setBlock({ id: blockId });
    modalRef.current.showModal();
  };

  const deleteFromLayout = () => {
    deleteFromLayoutApi(view.id, viewItem.id).then(() => {
      fetchView();
    });
  };

  const onCreateBlock = ({ block, type }: any) => {
    if (block) {
      fetchListBlocks();
      setBlock(block);
      modalRef.current.showModal();
    } else {
      addViewItem({ type, x: 0, y: 0, w: 4, h: type == "button" ? 2 : 5 });
    }
  };

  const layout = () => {
    if (!view?.ViewItems) return [];
    return view.ViewItems;
  };

  return (
    <div className="lg:px-8 px-3 md:px-5 pt-8">
      <div className="flex lg:gap-10">
        <div className="lg:w-[18rem] ">
          <Menu
            views={views}
            view={view}
            onClickBlock={clickBlock}
            editMode={editMode}
            blocks={blocks}
            workspace={workspace}
          />
        </div>
        <div className="lg:flex-1 w-full pb-10">
          <div className="relative  ">
            <Header
              workspace={workspace}
              view={view}
              save={saveView}
              refresh={refreshView}
              onCreate={onCreateBlock}
              isAdmin={isAdmin}
              editMode={editMode}
              setEditMode={setEditMode}
            />

            <div
              className={`lg:mt-10 ${
                editMode == "edit" ? "select-none edit-mode" : ""
              }`}
              ref={containerRef}
            >
              {containerWidth && (
                <GridLayout
                  className="relative"
                  cols={24}
                  style={{ minHeight: 600 }}
                  rowHeight={rowHeight}
                  width={containerWidth}
                  droppingItem={{ i: "__dropping-elem__", h: 10, w: 12 }}
                  margin={[20, 30]}
                  containerPadding={[0, 0]}
                  onDrop={onDrop}
                  isDroppable={editMode === "edit"}
                  onLayoutChange={(layout: any[]) => {
                    saveLayout(layout);
                  }}
                >
                  {layout().map((vItem: any) => (
                    <div
                      className={`group `}
                      key={vItem.id}
                      data-grid={{
                        x: vItem.x,
                        y: vItem.y,
                        w: vItem.w,
                        h: vItem.h,
                        static: editMode === "user",
                      }}
                    >
                      {isAdmin && editMode === "edit" && (
                        <ActionsEditButtons
                          viewItem={vItem}
                          setViewItem={setViewItem}
                          clickBlock={clickBlock}
                          onAction={(e: any, action: string) => {
                            e.stopPropagation();
                            if (action === "delete") {
                              actionsEditRef.current.deleteFromView(e);
                            } else if (action === "edit") {
                              actionsEditRef.current.edit(e);
                            }
                          }}
                        />
                      )}
                      {vItem.type == "block" && (
                        <div
                          className={`dark:border-white/10 border-neutral-300 border rounded-xl  overflow-y-auto max-h-full h-full flex justify-center bg-neutral-100 dark:bg-transparent ${
                            editMode == "edit" ? "grayscale" : ""
                          }`}
                        >
                          <Block blockId={vItem.blockId} defaultForm={{}} />
                        </div>
                      )}
                      {vItem.type == "button" && (
                        <div
                          className={`${editMode == "edit" ? "grayscale" : ""}`}
                        >
                          <Button editMode={editMode} options={vItem.options} />
                        </div>
                      )}
                      {vItem.type == "image" && (
                        <Image editMode={editMode} options={vItem.options} />
                      )}
                      {vItem.type == "text" && (
                        <Text editMode={editMode} options={vItem.options} />
                      )}
                    </div>
                  ))}
                </GridLayout>
              )}
            </div>
          </div>
        </div>
      </div>
      <ActionsEdit
        workspace={workspace}
        view={view}
        viewItem={viewItem}
        clickBlock={clickBlock}
        deleteFromLayout={deleteFromLayout}
        ref={actionsEditRef}
        reload={() => {
          fetchView();
        }}
      />
      <DS.Modal size="md" position="center" ref={modalRef}>
        {block && (
          <BlockAdmin
            jwt={jwt}
            views={views}
            reload={() => {
              fetchView();
              fetchListBlocks();
            }}
            onClose={() => {
              modalRef.current.hideModal();
            }}
            block={block}
            changeColorModal={(color: string) => {
              modalRef.current.changeColorModal(color);
            }}
          />
        )}
      </DS.Modal>
    </div>
  );
};
export default ViewBlock;

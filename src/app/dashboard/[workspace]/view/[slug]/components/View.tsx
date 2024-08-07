"use client";
import { useState, useEffect, useRef } from "react";
import GridLayout from "react-grid-layout";
import {
  viewGet,
  saveView as saveViewApi,
  saveLayout as saveLayoutApi,
  brainList,
  viewList,
  deleteFromLayout as deleteFromLayoutApi,
} from "@/app/services/brain";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DS } from "@blokay/react";
import { useScreen } from "@/hooks/useScreen";
import Header from "@/app/dashboard/[workspace]/view/[slug]/components/Header";
import Menu from "@/app/components/Menu/Menu";
import { uuidv4 } from "@/app/helpers/functions";
import ActionsEdit from "./ActionsEdit";
import ViewItem from "./ViewItem";
import BlockAdmin from "../../../../../components/BlockAdmin/Index";
import "/node_modules/react-grid-layout/css/styles.css";
import "./styles.css";

interface ViewProps {
  slug: string;
  jwt: string;
  workspace: string;
}
const View = ({ slug, jwt, workspace }: ViewProps) => {
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
  const [blockView, setBlockView]: any = useState(null);
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
    if (!session?.jwtToken) return;
    viewGet(slug, workspace, session?.jwtToken)
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

  useEffect(() => {
    fetchView();
  }, [session]);

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
        workspaceId: workspace,
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
    <>
      <div className="flex lg:gap-10 lg:px-8 px-3 md:px-5 pt-8">
        <Menu
          views={views}
          view={view}
          onClickBlock={clickBlock}
          editMode={editMode}
          blocks={blocks}
          workspace={workspace}
          setDefaultView={setBlockView}
          className="lg:w-[18rem]"
        />
        <div className="lg:flex-1 w-full pb-10 relative">
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
                  <ViewItem
                    setBlockView={setBlockView}
                    key={vItem.id}
                    vItem={vItem}
                    editMode={editMode}
                    clickBlock={clickBlock}
                    actionsEditRef={actionsEditRef}
                    isAdmin={isAdmin}
                    setViewItem={setViewItem}
                    setEditMode={setEditMode}
                    blocks={blocks}
                    className="group"
                    data-grid={{
                      x: vItem.x,
                      y: vItem.y,
                      w: vItem.w,
                      h: vItem.h,
                      static: editMode === "user",
                    }}
                  />
                ))}
              </GridLayout>
            )}
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
            defaultView={blockView}
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
    </>
  );
};
export default View;

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
import Header from "@/app/dashboard/view/[slug]/components/Header";
import Menu from "@/app/components/Menu/Menu";
import NeuronAdmin from "../../../../components/NeuronAdmin/NeuronAdmin";
import { useSession } from "next-auth/react";
import "./styles.css";
import { uuidv4 } from "@/app/helpers/functions";
import ActionsEdit from "./ActionsEdit";
import Image from "./Types/Image";
import Button from "./Types/Button";
import Text from "./Types/Text";
import ActionsEditButtons from "./ActionsEditButtons";

const ViewBrain = ({ slug }: any) => {
  const { data: session }: any = useSession();
  const isAdmin = session?.user?.rol == "admin";

  const actionsEditRef: any = useRef();
  const modalRef: any = useRef();
  const containerRef: any = useRef(null);
  const [view, setView]: any = useState(null);
  const [viewItem, setViewItem]: any = useState(null);
  const [neurons, setNeurons] = useState([]);
  const [containerWidth, setContainerWidth] = useState(null);
  const [neuron, setNeuron]: any = useState(null);
  const [editMode, setEditMode] = useState("user");
  const [views, setViews] = useState([]);

  const listViews = () => {
    viewList().then((result: any) => {
      setViews(result.Views);
    });
  };

  const fetchListNeurons = () => {
    brainList().then((l: any) => {
      setNeurons(l.Neurons);
    });
  };

  const fetchView = () => {
    viewGet(slug).then((r) => {
      setView(r.View);
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
    fetchListNeurons();
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

  const addViewItem = ({ neuronId = null, x, y, w, h, type }: any) => {
    const newLayout: any = [
      ...view.ViewItems,
      {
        x,
        y,
        w,
        h,
        type,
        neuronId,
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
    addViewItem({ ...layoutItem, type: "neuron", neuronId: i });
  };

  const clickNeuron = (neuronId: any) => {
    setNeuron({ id: neuronId });
    modalRef.current.showModal();
  };

  const deleteFromLayout = () => {
    deleteFromLayoutApi(view.id, viewItem.id).then(() => {
      fetchView();
    });
  };

  const onCreateNeuron = ({ neuron, type }: any) => {
    if (neuron) {
      fetchListNeurons();
      setNeuron(neuron);
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
    <div className="lg:px-8 px-5 pt-8">
      <div className="flex  gap-10">
        <div className="lg:w-[18rem]">
          <Menu
            views={views}
            view={view}
            onClickNeuron={clickNeuron}
            editMode={editMode}
            neurons={neurons}
          />
        </div>
        <div className="lg:flex-1 pb-10">
          <div className="relative  ">
            <Header
              view={view}
              save={saveView}
              refresh={refreshView}
              onCreate={onCreateNeuron}
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
                  rowHeight={10}
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
                      className="group"
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
                          clickNeuron={clickNeuron}
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
                      {vItem.type == "neuron" && (
                        <Block
                          editMode={editMode}
                          neuronId={vItem.neuronId}
                          defaultForm={{}}
                        />
                      )}
                      {vItem.type == "button" && (
                        <Button editMode={editMode} options={vItem.options} />
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
        view={view}
        viewItem={viewItem}
        clickNeuron={clickNeuron}
        deleteFromLayout={deleteFromLayout}
        ref={actionsEditRef}
        reload={() => {
          fetchView();
        }}
      />
      <DS.Modal size="md" position="center" ref={modalRef}>
        {neuron && (
          <NeuronAdmin
            views={views}
            reload={() => {
              fetchView();
              fetchListNeurons();
            }}
            onClose={() => {
              modalRef.current.hideModal();
            }}
            neuron={neuron}
            changeColorModal={(color: string) => {
              modalRef.current.changeColorModal(color);
            }}
          />
        )}
      </DS.Modal>
    </div>
  );
};
export default ViewBrain;

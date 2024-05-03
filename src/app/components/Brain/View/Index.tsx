"use client";
import { useState, useEffect, useRef } from "react";
import GridLayout from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import {
  viewGet,
  saveView as saveViewApi,
  brainList,
  viewList,
} from "@/app/services/brain";
import { AppModal } from "@/app/components/DS/Index";
import Header from "@/app/components/Header";
import Menu from "@/app/components/Menu/Menu";
import AddToView from "./AddToView";
import Neuron from "../Neuron/Neuron";
import NeuronAdmin from "../Neuron/Admin/NeuronAdmin";
import { useScreenDetector } from "@/app/hooks/user-screen-detector";

const ViewBrain = ({ slug }: any) => {
  const { isMobile } = useScreenDetector();
  const isAdmin =
    typeof localStorage != "undefined"
      ? localStorage.getItem("rol") === "admin"
      : null;
  const modalRef: any = useRef();
  const containerRef: any = useRef(null);
  const [view, setView]: any = useState(null);
  const [neurons, setNeurons] = useState([]);
  const [containerWidth, setContainerWidth] = useState(null);
  const [neuron, setNeuron] = useState(null);
  const [editMode, setEditMode] = useState(
    !isMobile && isAdmin ? "functions" : ""
  );
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
      if (isAdmin && r.View.layout?.length == 0) {
        setEditMode("grid");
      }
    });
  };
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
      id: view.id,
      ...form,
    });
  };

  const refreshView = () => {
    fetchView();
  };

  useEffect(() => {
    setContainerWidth(
      containerRef.current ? containerRef.current.offsetWidth : 0
    );
  }, [containerRef.current]);

  const onDrop = (layout: any[], layoutItem: any, _event: any) => {
    let i = _event.dataTransfer.getData("text/plain");

    saveView({
      layout: [
        ...view.layout,
        {
          ...layoutItem,
          i,
        },
      ],
    });
  };

  const clickNeuron = (neuron: any) => {
    setNeuron(neuron);
    modalRef.current.showModal();
  };

  const deleteFromLayout = (neuronId: any) => {
    let index = view.layout.findIndex((k: any) => k.i == neuronId);
    if (index !== -1) {
      let newLayout = view.layout.slice(0);
      newLayout.splice(index, 1);
      saveView({ layout: newLayout });
    }
  };

  const onCreateNeuron = (n: any) => {
    fetchListNeurons();
    setNeuron(n);
    modalRef.current.showModal();
  };

  return (
    <div className="container mx-auto pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3">
          <Menu
            views={views}
            view={view}
            onClickNeuron={clickNeuron}
            editMode={editMode}
            neurons={neurons}
          />
        </div>
        <div className="lg:col-span-9 pb-10">
          <div className="relative  ">
            <Header view={view} save={saveView} isAdmin={isAdmin} />

            {!isMobile && isAdmin && (
              <div className="flex items-center justify-between gap-3 mt-10">
                <AddToView
                  view={view}
                  save={saveView}
                  refresh={refreshView}
                  onCreate={onCreateNeuron}
                />

                {view?.layout?.length > 0 && (
                  <div className="flex  justify-end ">
                    <div className="bg-stone-300 flex select-none gap-0.5 items-center text-stone-900 p-1 rounded-lg">
                      <div
                        className={`px-2 py-1 text-sm  rounded-md ${
                          editMode == "functions"
                            ? "bg-white shadow-md"
                            : "hover:bg-stone-200"
                        }`}
                        onClick={() => setEditMode("functions")}
                      >
                        Functions
                      </div>
                      <div
                        className={`px-2 py-1 text-sm rounded-md ${
                          editMode == "grid"
                            ? "bg-white shadow-md"
                            : "hover:bg-stone-200"
                        }`}
                        onClick={() => setEditMode("grid")}
                      >
                        Grid
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div
              className={`lg:mt-10 ${editMode == "grid" ? "select-none" : ""}`}
              ref={containerRef}
            >
              {containerWidth && (
                <GridLayout
                  className="relative"
                  cols={12}
                  style={{ minHeight: 600 }}
                  rowHeight={15}
                  width={containerWidth}
                  droppingItem={{ i: "__dropping-elem__", h: 10, w: 6 }}
                  margin={[20, 30]}
                  containerPadding={[0, 0]}
                  onDrop={onDrop}
                  isDroppable={editMode === "grid"}
                  onLayoutChange={(layout: any[]) => {
                    if (layout.find((item) => isNaN(item.i))) {
                      return;
                    }
                    saveView({
                      layout: layout.map((l) => ({
                        i: l.i,
                        x: l.x,
                        y: l.y,
                        w: l.w,
                        h: l.h,
                      })),
                    });
                  }}
                >
                  {(view?.layout || []).map((neuron: any) => (
                    <div
                      key={neuron.i}
                      data-grid={{
                        x: neuron.x,
                        y: neuron.y,
                        w: neuron.w,
                        h: neuron.h,
                        static: editMode !== "grid",
                      }}
                    >
                      <Neuron
                        onEditNeuron={clickNeuron}
                        editMode={editMode}
                        neuronId={neuron.i}
                        defaultForm={{}}
                        deleteFromLayout={(neuronId: any) =>
                          deleteFromLayout(neuronId)
                        }
                      />
                    </div>
                  ))}
                </GridLayout>
              )}
            </div>
          </div>
        </div>
      </div>

      <AppModal size="md" position="center" ref={modalRef}>
        {neuron && (
          <NeuronAdmin
            reload={() => {
              //TODO
            }}
            neuron={neuron}
            changeColorModal={(color: string) => {
              modalRef.current.changeColorModal(color);
            }}
          />
        )}
      </AppModal>
    </div>
  );
};
export default ViewBrain;

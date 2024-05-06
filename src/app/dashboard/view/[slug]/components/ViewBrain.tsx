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
import { AppModal } from "@/app/components/DS/Index";
import Header from "@/app/dashboard/view/[slug]/components/Header";
import Menu from "@/app/components/Menu/Menu";
import Neuron from "../../../../components/Brain/Neuron/Neuron";
import NeuronAdmin from "../../../../components/Brain/Neuron/Admin/NeuronAdmin";
import { useScreenDetector } from "@/app/hooks/user-screen-detector";
import { useSession } from "next-auth/react";
import "./styles.css";
import { uuidv4 } from "@/app/helpers/functions";

const ViewBrain = ({ slug }: any) => {
  const { isMobile } = useScreenDetector();

  const { data: session }: any = useSession();
  const isAdmin = session?.user?.rol == "admin";

  const modalRef: any = useRef();
  const containerRef: any = useRef(null);
  const [view, setView]: any = useState(null);
  const [neurons, setNeurons] = useState([]);
  const [containerWidth, setContainerWidth] = useState(null);
  const [neuron, setNeuron] = useState(null);
  const [editMode, setEditMode] = useState(
    !isMobile && isAdmin ? "edit" : "user"
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
        setEditMode("edit");
      }
    });
  };
  useEffect(() => {
    listViews();
    fetchView();
    fetchListNeurons();
  }, []);

  useEffect(() => {
    if (isAdmin && !isMobile) {
      setEditMode("edit");
    }
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

  const saveLayout = (layout: any = []) => {
    saveLayoutApi({
      viewId: view.id,
      layout,
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

    const newLayout: any = [
      ...view.ViewItems,
      {
        ...layoutItem,
        type: "neuron",
        neuronId: i,
        id: uuidv4(),
      },
    ];
    setView({
      ...view,
      ViewItems: newLayout,
    });
    saveLayout(newLayout);
  };

  const clickNeuron = (neuron: any) => {
    setNeuron(neuron);
    modalRef.current.showModal();
  };

  const deleteFromLayout = (neuronId: any) => {
    // TODO
  };

  const onCreateNeuron = (n: any) => {
    fetchListNeurons();
    setNeuron(n);
    modalRef.current.showModal();
  };

  const layout = () => {
    if (!view?.ViewItems) return [];

    return view.ViewItems;
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
              className={`lg:mt-10 ${editMode == "edit" ? "select-none" : ""}`}
              ref={containerRef}
            >
              {containerWidth && (
                <GridLayout
                  className="relative"
                  cols={24}
                  style={{ minHeight: 600 }}
                  rowHeight={15}
                  width={containerWidth}
                  droppingItem={{ i: "__dropping-elem__", h: 10, w: 6 }}
                  margin={[20, 30]}
                  containerPadding={[0, 0]}
                  onDrop={onDrop}
                  isDroppable={editMode === "edit"}
                  onLayoutChange={(layout: any[]) => {
                    saveLayout(layout);
                  }}
                >
                  {layout().map((viewItem: any) => (
                    <div
                      key={viewItem.id}
                      data-grid={{
                        x: viewItem.x,
                        y: viewItem.y,
                        w: viewItem.w,
                        h: viewItem.h,
                        static: editMode === "user",
                      }}
                    >
                      {viewItem.type == "neuron" && (
                        <Neuron
                          onEditNeuron={clickNeuron}
                          editMode={editMode}
                          neuronId={viewItem.neuronId}
                          defaultForm={{}}
                          deleteFromLayout={(neuronId: any) =>
                            deleteFromLayout(neuronId)
                          }
                        />
                      )}
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

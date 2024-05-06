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
import { AppButton, AppModal } from "@/app/components/DS/Index";
import Header from "@/app/dashboard/view/[slug]/components/Header";
import Menu from "@/app/components/Menu/Menu";
import Neuron from "../../../../components/Brain/Neuron/Neuron";
import NeuronAdmin from "../../../../components/Brain/Neuron/Admin/NeuronAdmin";
import { useScreenDetector } from "@/app/hooks/user-screen-detector";
import { useSession } from "next-auth/react";
import "./styles.css";
import { uuidv4 } from "@/app/helpers/functions";
import ActionsEdit from "./ActionsEdit";

const ViewBrain = ({ slug }: any) => {
  const { isMobile } = useScreenDetector();

  const { data: session }: any = useSession();
  const isAdmin = session?.user?.rol == "admin";

  const modalRef: any = useRef();
  const containerRef: any = useRef(null);
  const [view, setView]: any = useState(null);
  const [viewItem, setViewItem]: any = useState(null);
  const [neurons, setNeurons] = useState([]);
  const [containerWidth, setContainerWidth] = useState(null);
  const [neuron, setNeuron]: any = useState(null);
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
      ViewItems: newLayout,
    });
    saveLayout(newLayout);
  };

  const onDrop = (layout: any[], layoutItem: any, _event: any) => {
    let i = _event.dataTransfer.getData("text/plain");
    addViewItem({ ...layoutItem, type: "neuron", neuronId: i });
  };

  const clickNeuron = (neuronId: any) => {
    setNeuron({ id: neuronId });
    modalRef.current.showModal();
  };

  const deleteFromLayout = (viteItemId: any) => {
    deleteFromLayoutApi(view.id, viteItemId).then(() => {
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
                  rowHeight={10}
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
                      <div className="hidden group-hover:block">
                        <ActionsEdit
                          viewItem={vItem}
                          setViewItem={setViewItem}
                          clickNeuron={clickNeuron}
                          deleteFromLayout={deleteFromLayout}
                        />
                      </div>

                      {vItem.type == "neuron" && (
                        <Neuron
                          onEditNeuron={clickNeuron}
                          editMode={editMode}
                          neuronId={vItem.neuronId}
                          defaultForm={{}}
                        />
                      )}
                      {vItem.type == "button" && (
                        <AppButton
                          text="Button"
                          className="w-full"
                          variant="primary"
                        />
                      )}
                      {vItem.type == "image" && (
                        <>
                          <img
                            src="https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/media/image/2022/11/pikachu-pokemon-escarlata-purpura-2888180.jpg?tf=1200x1200"
                            alt=""
                          />
                        </>
                      )}
                      {vItem.type == "text" && <>Lorem ipsum data</>}
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

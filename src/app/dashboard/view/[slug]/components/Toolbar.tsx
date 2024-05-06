"use client";
import { useRef, useState } from "react";
import {
  AppIcon,
  AppModal,
  AppButton,
  AppInput,
} from "@/app/components/DS/Index";
import { newNeuron } from "@/app/services/brain";

export default function Toolbar({
  title,
  onSetTitle,
  refresh,
  save,
  onCreate = null,
  setEditMode,
  editMode,
}: any) {
  const modalRef: any = useRef();
  const [form, setForm]: any = useState({ type: "function" });
  const [clickAction, setClickAction]: any = useState("");

  const handleClickNew = () => {
    modalRef.current.showModal();
  };
  const handleClickCreateNewNeuron = () => {
    newNeuron(form).then((neuron) => {
      modalRef.current.hideModal();
      onCreate && onCreate({ neuron });
      setForm({});
    });
  };

  const addBlockView = (type: string) => {
    onCreate && onCreate({ type });
    setClickAction("");
  };

  return (
    <>
      <div className="relative">
        <div className="toolbar">
          {editMode === "edit" && (
            <>
              <div className="item group square" onClick={handleClickNew}>
                <AppIcon icon="add" />
              </div>
              <div
                className={`item square ${
                  clickAction == "new" ? "active" : ""
                }`}
                onClick={() => setClickAction("new")}
              >
                <AppIcon icon="smart_button" />
              </div>
            </>
          )}
          {/* <div className="item square">
          <AppIcon icon="wizard" />
        </div>

        
        <div className="item square">
          <AppIcon icon="general" />
        </div> */}

          <div className="item aspect-auto">
            <input
              className="text-stone-900 text-lg px-5 font-medium bg-transparent focus:outline-none w-full "
              value={title}
              disabled={editMode === "user"}
              onChange={(e) => {
                onSetTitle(e.target.value);
              }}
            />
          </div>
          <div
            className={`item square ${editMode == "edit" ? "active" : ""}`}
            onClick={() => setEditMode("edit")}
          >
            <AppIcon icon="grid" />
          </div>

          <div
            className={`item square ${editMode == "user" ? "active" : ""}`}
            onClick={() => setEditMode("user")}
          >
            <AppIcon icon="view" />
          </div>
        </div>
        {clickAction && (
          <div
            onClick={() => setClickAction("")}
            className="fixed w-full bg-stone-400/20 min-h-screen top-0 left-0 z-10 backdrop-blur-sm"
          ></div>
        )}
        {clickAction == "new" && (
          <div className="action-box ">
            <div className=" item" onClick={() => addBlockView("button")}>
              <AppIcon icon="smart_button" />
              <div>Add Button</div>
            </div>

            <div className=" item" onClick={() => addBlockView("image")}>
              <AppIcon icon="image" />
              <div>Add Image</div>
            </div>

            <div className=" item" onClick={() => addBlockView("text")}>
              <AppIcon icon="general" />
              <div>Add Text</div>
            </div>
          </div>
        )}
      </div>

      <AppModal
        size="sm"
        title="Add new"
        ref={modalRef}
        footer={
          <AppButton
            text="Add new"
            onClick={() => handleClickCreateNewNeuron()}
            variant="primary"
            className="w-full"
            size="md"
          />
        }
      >
        <AppInput
          onChange={(val: string) => {
            setForm({ ...form, name: val });
          }}
          type="text"
          value={form.name}
          label="Name of the block"
        />
      </AppModal>
    </>
  );
}

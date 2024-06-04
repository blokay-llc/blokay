"use client";
import { useRef, useState } from "react";
import { DS } from "@blokay/react";
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
                <DS.Icon icon="add" />
              </div>
              <div
                className={`item square ${
                  clickAction == "new" ? "active" : ""
                }`}
                onClick={() => setClickAction("new")}
              >
                <DS.Icon icon="smart_button" />
              </div>
            </>
          )}

          <div className="item aspect-auto">
            <input
              className="text-stone-900 dark:text-stone-100 text-lg px-5 font-medium bg-transparent focus:outline-none w-full "
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
            <DS.Icon icon="grid" />
          </div>
          <div
            className={`item square ${editMode == "user" ? "active" : ""}`}
            onClick={() => setEditMode("user")}
          >
            <DS.Icon icon="view" />
          </div>
        </div>
        {clickAction && (
          <div
            onClick={() => setClickAction("")}
            className="fixed w-full bg-stone-400/20 dark:bg-stone-700/40 min-h-screen top-0 left-0 z-10 backdrop-blur-sm"
          ></div>
        )}
        {clickAction == "new" && (
          <div className="action-box ">
            <div className=" item" onClick={() => addBlockView("button")}>
              <DS.Icon icon="smart_button" />
              <div>Add Button</div>
            </div>

            <div className=" item" onClick={() => addBlockView("image")}>
              <DS.Icon icon="image" />
              <div>Add Image</div>
            </div>

            <div className=" item" onClick={() => addBlockView("text")}>
              <DS.Icon icon="general" />
              <div>Add Text</div>
            </div>
          </div>
        )}
      </div>

      <DS.Modal
        size="sm"
        title="Add new"
        ref={modalRef}
        footer={
          <DS.Button
            text="Add new"
            onClick={() => handleClickCreateNewNeuron()}
            variant="primary"
            className="w-full"
            size="md"
          />
        }
      >
        <DS.Input
          onChange={(val: string) => {
            setForm({ ...form, name: val });
          }}
          type="text"
          value={form.name}
          label="Name of the block"
        />
      </DS.Modal>
    </>
  );
}

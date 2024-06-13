"use client";
import { useRef, useState } from "react";
import { DS } from "@blokay/react";
import { newNeuron } from "@/app/services/brain";
import { useApi } from "@/hooks/useApi";

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
  const { loading, errors, callApi } = useApi(newNeuron);

  const handleClickNew = () => {
    modalRef.current.showModal();
  };
  const handleClickCreateNewBlock = () => {
    callApi(form).then((block) => {
      modalRef.current.hideModal();
      onCreate && onCreate({ block });
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
                <div className="option">
                  <DS.Icon icon="add" />
                </div>
              </div>
              <div
                className={`item square ${
                  clickAction == "new" ? "active" : ""
                }`}
                onClick={() => setClickAction("new")}
              >
                <div className="option">
                  <DS.Icon icon="smart_button" />
                </div>
              </div>
            </>
          )}

          <div className="item aspect-auto">
            <input
              className="text-neutral-900 dark:text-neutral-100 text-lg px-5 font-medium bg-transparent focus:outline-none w-full "
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
            <div className="option">
              <DS.Icon icon="grid" />
            </div>
          </div>
          <div
            className={`item square ${editMode == "user" ? "active" : ""}`}
            onClick={() => {
              setEditMode("user");
              setClickAction("");
            }}
          >
            <div className="option">
              <DS.Icon icon="view" />
            </div>
          </div>
        </div>
        {clickAction && editMode == "edit" && (
          <div
            onClick={() => setClickAction("")}
            className="fixed w-full bg-neutral-400/20 dark:bg-neutral-700/40 min-h-screen top-0 left-0 z-10 backdrop-blur-sm"
          ></div>
        )}
        {clickAction == "new" && editMode == "edit" && (
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
            onClick={() => handleClickCreateNewBlock()}
            variant="primary"
            className="w-full"
            size="md"
            loading={loading}
          />
        }
      >
        <DS.Input
          onChange={(val: string) => {
            setForm({ ...form, name: val });
          }}
          type="text"
          value={form.name}
          error={errors?.name || errors?.key}
          label="Name of the block"
        />
      </DS.Modal>
    </>
  );
}

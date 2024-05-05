"use client";
import { useRef, useState } from "react";
import {
  AppIcon,
  AppModal,
  AppButton,
  AppInput,
} from "@/app/components/DS/Index";
import { newNeuron } from "@/app/services/brain";

import "./styles.css";

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
  const [form, setForm]: any = useState({});

  const handleClickNew = () => {
    modalRef.current.showModal();
  };
  const handleClickCreateNewNeuron = () => {
    newNeuron(form).then((neuron) => {
      modalRef.current.hideModal();
      onCreate && onCreate(neuron);
      setForm({});
    });
  };
  const previewClick = () => {
    setEditMode("user");
  };

  return (
    <>
      <div className="toolbar">
        {editMode === "edit" && (
          <>
            <div className="item square" onClick={handleClickNew}>
              <AppIcon icon="add" />
            </div>
            <div className="item square">
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

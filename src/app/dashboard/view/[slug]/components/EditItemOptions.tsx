"use client";
import { useState, useEffect } from "react";
import { AppInput, AppSelect, AppButton } from "@/app/components/DS/Index";
import { brainList, viewItemEdit } from "@/app/services/brain";

export default function EditItemOptions({
  id,
  type,
  options,
  onHide,
  onUpdate,
  viewId,
}: any) {
  if (!type) return <></>;
  const [form, setForm] = useState({ ...options });
  const [neurons, setNeurons] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchListNeurons = () => {
    brainList().then((l: any) => {
      setNeurons(l.Neurons);
    });
  };

  useEffect(() => {
    fetchListNeurons();
  }, []);

  const fetchViewItemEdit = (form: any) => {
    setLoading(true);
    viewItemEdit({
      options: form,
      viewId: viewId,
      viewItemId: id,
    }).finally(() => {
      setLoading(false);
      onUpdate && onUpdate(form);
    });
  };

  return (
    <div
      className="flex gap-2 flex-col"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {type == "text" && (
        <>
          <AppInput
            type="text"
            value={form.text}
            onChange={(val: string) => {
              setForm({ ...form, text: val });
            }}
            label={"Text"}
          />
        </>
      )}

      {type == "image" && (
        <>
          <AppInput
            type="text"
            value={form.image}
            onChange={(val: string) => {
              setForm({ ...form, image: val });
            }}
            label={"URL image"}
          />
        </>
      )}

      {type == "button" && (
        <>
          <AppInput
            type="text"
            value={form.label}
            //   error={errors[row.name]}
            onChange={(val: string) => {
              setForm({ ...form, label: val });
            }}
            label={"Button label"}
          />

          <AppSelect
            value={form.click}
            label="Click event"
            onChange={(val: string) => {
              setForm({ ...form, click: val });
            }}
          >
            <option value="">Select an option</option>
            <option value="openNeuron">Open Neuron</option>
            {/* <option value="customJS">Custom JS</option> */}
          </AppSelect>

          {form.click === "openNeuron" && (
            <AppSelect
              value={form.neuronKey}
              label="Neuron name"
              onChange={(val: string) => {
                setForm({ ...form, neuronKey: val });
              }}
            >
              <option value="">Select an option</option>

              {neurons.map((neuron: any) => (
                <option value={neuron.key}>{neuron.name}</option>
              ))}
            </AppSelect>
          )}
        </>
      )}

      <div className="flex items-center gap-5 mt-3 pt-3 border-t dark:border-stone-800 border-stone-200">
        <AppButton
          text="Cancel"
          onClick={() => onHide && onHide()}
          variant="secondary"
          className="w-full"
          size="md"
        />
        <AppButton
          loading={loading}
          text="Update"
          onClick={() => {
            fetchViewItemEdit(form);
          }}
          variant="primary"
          className="w-full"
          size="md"
        />
      </div>
    </div>
  );
}

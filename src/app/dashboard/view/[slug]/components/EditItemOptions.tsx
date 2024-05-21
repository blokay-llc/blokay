"use client";
import { useState, useEffect } from "react";
import { DS } from "@blokay/react";
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
          <DS.Input
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
          <DS.Input
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
          <DS.Input
            type="text"
            value={form.label}
            //   error={errors[row.name]}
            onChange={(val: string) => {
              setForm({ ...form, label: val });
            }}
            label={"Button label"}
          />

          <DS.Select
            value={form.click}
            label="Click event"
            onChange={(val: string) => {
              setForm({ ...form, click: val });
            }}
          >
            <option value="">Select an option</option>
            <option value="openNeuron">Open Neuron</option>
            {/* <option value="customJS">Custom JS</option> */}
          </DS.Select>

          {form.click === "openNeuron" && (
            <DS.Select
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
            </DS.Select>
          )}
        </>
      )}

      <div className="flex items-center gap-5 mt-3 pt-3 border-t dark:border-stone-800 border-stone-200">
        <DS.Button
          text="Cancel"
          onClick={() => onHide && onHide()}
          variant="secondary"
          className="w-full"
          size="md"
        />
        <DS.Button
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

"use client";

import { useState, useEffect, useRef } from "react";
import {
  AppInput,
  AppModal,
  AppSelect,
  AppButton,
  AppCheckbox,
} from "@/app/components/DS/Index";
import { updateNeuron, deleteNeuron } from "@/app/services/brain";

const NeuronGeneral = ({ neuron, reload }: any) => {
  const modalDeleteRef: any = useRef();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    ...neuron,
    filters: { fields: [], button: null, ...neuron?.filters },
  });

  const [fields, setFields] = useState([...(neuron?.filters?.fields || [])]);

  const addField = () => {
    setFields([
      ...fields,
      {
        type: "text",
        name: "name",
        label: "",
      },
    ]);
  };

  const saveChanges = () => {
    setLoading(true);
    updateNeuron({
      ...form,
      neuronId: neuron.id,
      filters: {
        ...form.filters,
        fields,
      },
    })
      .then((result) => {
        reload && reload();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (id: string) => {
    setLoading(true);
    deleteNeuron({
      neuronId: neuron.id,
    })
      .then((result) => {
        modalDeleteRef.current.hideModal();
        reload && reload();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setFields([...(neuron?.filters?.fields || [])]);

    setForm({
      ...neuron,
      filters: { ...neuron?.filters, button: neuron?.filters?.button || null },
    });
  }, [neuron]);

  return (
    <div>
      <AppInput
        type="text"
        disabled={true}
        value={form.key}
        label="ID"
        className="mb-3"
        onChange={(val: string) => {
          setForm({ ...form, description: val });
        }}
      />

      <AppInput
        type="textarea"
        value={form.description}
        label="Description"
        onChange={(val: string) => {
          setForm({ ...form, description: val });
        }}
      />

      <div className="mt-5 pt-5 border-t border-stone-300">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-bold text-stone-700 ">Input data</h2>
          <AppButton
            text="Add field"
            onClick={addField}
            icon="add"
            variant="secondary"
            size="sm"
          />
        </div>
        <div className="mb-5">
          {fields.map((row, index) => (
            <div
              key={"field-" + index}
              className="grid grid-cols-12 gap-3 mb-3 bg-stone-100 items-center py-2 rounded-lg px-3"
            >
              <div className="col-span-3">
                <AppInput
                  type="text"
                  value={fields[index].name}
                  label="Name"
                  onChange={(val: string) => {
                    let f = fields.slice(0);
                    f[index].name = val;
                    setFields(f);
                  }}
                />
              </div>
              <div className="col-span-2">
                <AppSelect
                  value={fields[index].type}
                  label="Type"
                  onChange={(val: string) => {
                    let f = fields.slice(0);
                    f[index].type = val;
                    setFields(f);
                  }}
                >
                  <option value="select">select</option>
                  <option value="date">date</option>
                  <option value="time">time</option>
                  <option value="number">number</option>
                  <option value="text">text</option>
                  <option value="email">email</option>
                  <option value="money">money</option>
                  <option value="email">email</option>
                  <option value="hidden">hidden</option>
                </AppSelect>
              </div>
              <div className="col-span-4">
                <AppInput
                  type="text"
                  value={fields[index].label}
                  label="Label"
                  onChange={(val: string) => {
                    let f = fields.slice(0);
                    f[index].label = val;
                    setFields(f);
                  }}
                />
              </div>
              <div className="col-span-3">
                <AppCheckbox
                  type="text"
                  value={fields[index].isRequired}
                  label="¿obligatorio?"
                  onChange={() => {
                    let f = fields.slice(0);
                    f[index].isRequired = !!!f[index].isRequired;
                    setFields(f);
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <AppInput
          type="text"
          value={form.filters.button}
          label="Button Text"
          onChange={(val: string) => {
            setForm({
              ...form,
              filters: {
                ...form.filters,
                button: val,
              },
            });
          }}
        />

        <div className="mt-10 pt-3 border-t flex justify-between border-stone-200">
          <AppButton
            text="Delete this"
            onClick={() => {
              modalDeleteRef.current.showModal();
            }}
            icon="delete"
            variant="secondary"
            size="lg"
          />

          <AppButton
            loading={loading}
            text="Save"
            onClick={() => saveChanges()}
            icon="save"
            variant="primary"
            size="lg"
          />
        </div>
      </div>

      <AppModal
        title="Delete function"
        footer={
          <div className="flex items-center gap-5">
            <AppButton
              text="No, cancel"
              onClick={() => modalDeleteRef.current.hideModal()}
              variant="secondary"
              className="w-full"
              size="md"
            />
            <AppButton
              text="Yes, delete"
              onClick={handleDelete}
              variant="primary"
              className="w-full"
              size="md"
              disabled={form.textDeleteNeuron != "yes, delete"}
            />
          </div>
        }
        size="sm"
        ref={modalDeleteRef}
      >
        <AppInput
          type="text"
          value={form.textDeleteNeuron}
          label="Write (yes, delete)"
          className="mb-3"
          onChange={(val: string) => {
            setForm({ ...form, textDeleteNeuron: val });
          }}
        />
      </AppModal>
    </div>
  );
};
export default NeuronGeneral;

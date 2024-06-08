"use client";

import { useState, useEffect, useRef } from "react";
import { DS } from "@blokay/react";
import { updateNeuron, deleteNeuron } from "@/app/services/brain";

const General = ({ neuron, reload, onClose }: any) => {
  const modalDeleteRef: any = useRef();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    ...neuron,
    filters: { fields: [], button: null, ...neuron?.filters },
  });

  const [fields, setFields] = useState([...(neuron?.filters?.fields || [])]);
  const [fieldIndex, setFieldIndex] = useState(0);

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

  const addOption = () => {
    if (!fields[fieldIndex].options) fields[fieldIndex].options = [];
    fields[fieldIndex].options.push({ value: "", label: "" });
    setFields([...fields]);
  };

  const removeField = (event: any, index: number) => {
    event.stopPropagation();
    setFieldIndex(0);
    setFields([...fields.slice(0, index), ...fields.slice(index + 1)]);
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
        onClose && onClose();
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
      <DS.Input
        type="text"
        disabled={true}
        value={form.key}
        label="ID"
        className="mb-3"
        onChange={(val: string) => {
          setForm({ ...form, description: val });
        }}
      />

      <DS.Input
        type="text"
        value={form.description}
        label="Description"
        onChange={(val: string) => {
          setForm({ ...form, description: val });
        }}
      />

      <div className="mt-5 pt-5 border-t border-neutral-300 dark:border-neutral-800">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DS.Select
              value={form.type}
              label="Type"
              onChange={(val: string) => {
                setForm({ ...form, type: val });
              }}
            >
              <option value="function">Function</option>
              <option value="cron">Cron Job</option>
            </DS.Select>

            <h2 className="font-bold text-neutral-700 dark:text-neutral-400 ">
              {form.type == "cron" ? "Cron Job" : "Input data"}
            </h2>
          </div>

          {form.type == "function" && (
            <DS.Button
              text="Add field"
              onClick={addField}
              icon="add"
              variant="secondary"
              size="sm"
            />
          )}
        </div>

        {form.type == "function" && (
          <>
            {fields.length > 0 && (
              <div className="mb-5 select-none border border-neutral-800 rounded-lg px-5">
                <div className="grid grid-cols-1 gap-5 divide-x divide-neutral-800 md:grid-cols-12">
                  <div className="md:col-span-5 py-5">
                    {fields.map((row, index) => (
                      <div
                        onClick={() => setFieldIndex(index)}
                        key={"field-" + index}
                        className={`flex gap-3 mb-2 group  items-center py-1 rounded-lg px-3 font-medium text-sm ${
                          fieldIndex == index
                            ? "bg-neutral-200 dark:bg-neutral-800"
                            : ""
                        }`}
                      >
                        <span className="text-blue-600 text-xs">
                          {fields[index].type}
                        </span>
                        <span>{fields[index].name}</span>
                        <div
                          className="ml-auto cursor-pointer opacity-0 group-hover:opacity-100 transition duration-200"
                          onClick={(e) => removeField(e, index)}
                        >
                          <DS.Icon
                            icon="delete"
                            className="fill-white size-3"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="md:col-span-7 py-5">
                    {fields[fieldIndex] && (
                      <div className="grid grid-cols-1 xl:grid-cols-2 w-full gap-3 mb-3   py-1 rounded-lg px-3">
                        <div>
                          <DS.Select
                            value={fields[fieldIndex].type}
                            label="Type"
                            onChange={(val: string) => {
                              let f = fields.slice(0);
                              f[fieldIndex].type = val;
                              setFields(f);
                            }}
                          >
                            <option value="url">url</option>
                            <option value="checkbox">checkbox</option>
                            <option value="file">file</option>
                            <option value="select">select</option>
                            <option value="date">date</option>
                            <option value="time">time</option>
                            <option value="number">number</option>
                            <option value="text">text</option>
                            <option value="textarea">textarea</option>
                            <option value="email">email</option>
                            <option value="money">money</option>
                            <option value="email">email</option>
                            <option value="hidden">hidden</option>
                          </DS.Select>
                        </div>
                        <div>
                          <DS.Input
                            type="text"
                            value={fields[fieldIndex].name}
                            label="Name"
                            onChange={(val: string) => {
                              let f = fields.slice(0);
                              f[fieldIndex].name = val;
                              setFields(f);
                            }}
                          />
                        </div>

                        <div>
                          <DS.Input
                            type="text"
                            value={fields[fieldIndex].label}
                            label="Label"
                            onChange={(val: string) => {
                              let f = fields.slice(0);
                              f[fieldIndex].label = val;
                              setFields(f);
                            }}
                          />
                        </div>
                        <div>
                          <DS.Checkbox
                            type="text"
                            value={fields[fieldIndex].isRequired}
                            label="Required?"
                            onChange={() => {
                              let f = fields.slice(0);
                              f[fieldIndex].isRequired =
                                !!!f[fieldIndex].isRequired;
                              setFields(f);
                            }}
                          />
                        </div>

                        {fields[fieldIndex].type == "select" && (
                          <div className="md:col-span-2">
                            <div className="mb-3 flex items-center justify-between">
                              <h2 className="text-sm font-medium ">Options</h2>
                              <DS.Button
                                text="Add"
                                onClick={addOption}
                                icon="add"
                                variant="secondary"
                                size="xs"
                              />
                            </div>

                            {fields[fieldIndex]?.options?.length > 0 && (
                              <div className="flex flex-col gap-1">
                                {fields[fieldIndex].options.map(
                                  (option: any, index: number) => (
                                    <div
                                      className="md:col-span-2 grid grid-cols-2 gap-3"
                                      key={"option-" + fieldIndex + "-" + index}
                                    >
                                      <DS.Input
                                        type="text"
                                        value={
                                          fields[fieldIndex].options[index]
                                            .value
                                        }
                                        label="value"
                                        onChange={(val: string) => {
                                          let f = fields.slice(0);
                                          f[fieldIndex].options[index].value =
                                            val;
                                          setFields(f);
                                        }}
                                      />
                                      <DS.Input
                                        type="text"
                                        value={
                                          fields[fieldIndex].options[index]
                                            .label
                                        }
                                        label="label"
                                        onChange={(val: string) => {
                                          let f = fields.slice(0);
                                          f[fieldIndex].options[index].label =
                                            val;
                                          setFields(f);
                                        }}
                                      />
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <DS.Input
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
          </>
        )}

        {form.type == "cron" && (
          <>
            <div className="flex items-center gap-3">
              <div className="lg:w-2/5">
                <DS.Select
                  value={form.cron}
                  label="Type"
                  onChange={(val: string) => {
                    setForm({ ...form, cron: val });
                  }}
                >
                  <option value="* * * * *">Every minute</option>
                  <option value="*/5 * * * *">Every 5 minutes</option>
                  <option value="*/10 * * * *">Every 10 minutes</option>
                  <option value="*/15 * * * *">Every 15 minutes</option>
                  <option value="*/30 * * * *">Every 30 minutes</option>
                  <option value="0 * * * *">Every hour</option>
                  <option value="0 */6 * * *">Every 6 hours</option>
                  <option value="0 */12 * * *">Every 12 hours</option>
                  <option value="0 0 * * *">Every day</option>
                  <option value="0 0 */3 * *">Every 3 day</option>
                  <option value="0 0 */7 * *">Every 7 day</option>
                  <option value="0 0 */15 * *">Every 15 day</option>
                  <option value="0 0 0 * *">Every month</option>
                </DS.Select>
              </div>

              <DS.Input
                type="text"
                value={form.cron}
                label="Cron Job"
                onChange={(val: string) => {
                  setForm({
                    ...form,
                    cron: val,
                  });
                }}
              />
            </div>
          </>
        )}

        <div className="mt-10 pt-3 border-t flex justify-between border-neutral-200 dark:border-neutral-800">
          <DS.Button
            text="Delete this"
            onClick={() => {
              modalDeleteRef.current.showModal();
            }}
            icon="delete"
            variant="secondary"
            size="md"
          />

          <DS.Button
            loading={loading}
            text="Save"
            onClick={() => saveChanges()}
            icon="save"
            variant="primary"
            size="md"
          />
        </div>
      </div>

      <DS.Modal
        title="Delete function"
        footer={
          <div className="flex items-center gap-5">
            <DS.Button
              text="No, cancel"
              onClick={() => modalDeleteRef.current.hideModal()}
              variant="secondary"
              className="w-full"
              size="md"
            />
            <DS.Button
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
        <DS.Input
          type="text"
          value={form.textDeleteNeuron}
          label="Write (yes, delete)"
          className="mb-3"
          onChange={(val: string) => {
            setForm({ ...form, textDeleteNeuron: val });
          }}
        />
      </DS.Modal>
    </div>
  );
};
export default General;

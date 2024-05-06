"use client";
import { useState, useEffect } from "react";
import { brainGet, brainExec } from "@/app/services/brain";
import {
  AppButton,
  AppInput,
  AppSelect,
  AppLoader,
} from "@/app/components/DS/Index";
import NeuronResponse from "./NeuronResponse";

const Neuron = ({
  neuronId,
  neuronKey,
  defaultForm,
  onExec,
  onBack,
  editMode = "",
}: any) => {
  const [form, setForm] = useState({ ...defaultForm });
  const [neuron, setNeuron]: any = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]: any = useState({});
  const [autoexecuted, setAutoxecuted]: any = useState(false);

  const getNeuron = ({ neuronId, neuronKey }: any) => {
    if (!neuronId && !neuronKey) return;
    if (loading) return;
    setLoading(true);
    brainGet({ neuronId, neuronKey })
      .then((result) => {
        let n = result.Neuron;
        let autoExec =
          (result.Neuron.filters.autoExec == undefined ||
            result.Neuron.filters.autoExec) &&
          !n.filters?.fields?.length;

        setAutoxecuted(autoExec);
        setNeuron(n);

        if (autoExec) {
          return execNeuron(n);
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const execNeuron = (n: any) => {
    const errorsTmp: any = {};

    if (n.filters?.fields) {
      for (let field of n.filters?.fields) {
        if (!form[field.name] && field.isRequired) {
          errorsTmp[field.name] = "El campo es requerido";
        }
      }
      if (Object.values(errorsTmp).length > 0) {
        setErrors(errorsTmp);
        return;
      }
    }

    if (loading) return;
    setLoading(true);
    setErrors({});

    brainExec({
      neuronId: n.id,
      form,
    })
      .then((result) => {
        setResponse(result.response);
        onExec && onExec(result.response);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getNeuron({ neuronId, neuronKey });
  }, []);

  return (
    <div className="h-full group relative border-2 border-stone-300 overflow-y-hidden  rounded-2xl pt-0">
      <div
        className={`"overflow-y-auto max-h-full h-full flex w-full ${
          !response ? "items-center" : ""
        } justify-center `}
      >
        {loading && <AppLoader size="md" />}

        {!loading && (
          <div
            className={`w-full ${
              editMode === "grid" ? "opacity-70 grayscale" : ""
            }`}
          >
            {!neuron?.id && (
              <div className="text-center text-stone-600 text-lg">
                This doesn't exists
              </div>
            )}
            {neuron &&
              !response &&
              (neuron.filters.autoExec == false ||
                neuron.filters?.fields?.length > 0) && (
                <div className="py-6 h-full flex items-center justify-center ">
                  <div className=" lg:max-w-96 lg:min-w-96 min-w-[90%] bg-white rounded-xl px-5 pb-5 pt-10">
                    <div className="flex items-center gap-3">
                      {onBack && (
                        <div
                          className="flex gap-3 items-center"
                          onClick={() => onBack()}
                        >
                          <div className="size-8 p-1 cursor-pointer hover:bg-slate-300 rounded-full bg-slate-200">
                            <svg
                              viewBox="0 0 24 24"
                              className="fill-slate-900 w-full h-full"
                            >
                              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
                            </svg>
                          </div>
                          <div></div>
                        </div>
                      )}
                      <h2 className="text-base md:text-lg font-medium text-stone-600">
                        {neuron.description}
                      </h2>
                    </div>

                    {neuron.filters?.fields && (
                      <div className="grid grid-cols-2 w-full gap-3 mt-5">
                        {neuron.filters.fields.map(
                          (row: any, index: number) => (
                            <div
                              key={index}
                              className={`${
                                row.grid == 6 ? "col-span-1" : "col-span-2"
                              } `}
                            >
                              {row.type == "select" && (
                                <AppSelect
                                  value={form[row.name]}
                                  error={errors[row.name]}
                                  onChange={(val: string) => {
                                    setForm({ ...form, [row.name]: val });
                                  }}
                                  label={row.label}
                                >
                                  <option value="">
                                    Selecciona una opción
                                  </option>
                                  {row.options?.length > 0 &&
                                    row.options.map(
                                      (opt: any, index: number) => (
                                        <option key={index} value={opt.value}>
                                          {opt.label}
                                        </option>
                                      )
                                    )}
                                </AppSelect>
                              )}
                              {!["select", "hidden"].includes(row.type) && (
                                <AppInput
                                  type={row.type}
                                  value={form[row.name]}
                                  error={errors[row.name]}
                                  onChange={(val: string) => {
                                    setForm({ ...form, [row.name]: val });
                                  }}
                                  label={row.label}
                                />
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}

                    <div className="mt-5 md:mt-5 border-t-2  border-gray-200 pt-5 text-center flex gap-3 md:gap-5">
                      <AppButton
                        text={neuron?.filters?.button || "Generar"}
                        onClick={() => execNeuron(neuron)}
                        variant="primary"
                        className="w-full"
                        size="lg"
                        color="blue"
                      />
                    </div>
                  </div>
                </div>
              )}

            {response && (
              <NeuronResponse
                response={response}
                neuron={neuron}
                onReload={() => {
                  execNeuron(neuron);
                }}
                autoExecuted={neuron.filters.autoExec}
                onBack={
                  !autoexecuted
                    ? () => {
                        setResponse(null);
                      }
                    : null
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Neuron;

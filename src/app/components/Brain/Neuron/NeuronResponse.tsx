"use client";
import AppData from "./Types/AppData";
import AppLine from "./Types/AppLine";
import AppValue from "./Types/AppValue";
import AppException from "./Types/AppException";

const NeuronResponse = ({
  neuron,
  response,
  onReload,
  onBack,
  autoExecuted,
}: any) => {
  return (
    <>
      <div className="  h-full overflow-y-auto p-5 ">
        {response?.type == "exception" && (
          <AppException data={response.content} />
        )}

        {response?.type == "table" && (
          <AppData
            neuronName={neuron?.description}
            data={response.content}
            onReload={onReload}
            onBack={onBack}
            autoExecuted={autoExecuted}
          />
        )}

        {response?.type == "line" && (
          <AppLine
            title={neuron.description}
            data={response.content}
            onReload={onReload}
          />
        )}
        {response?.type == "value" && (
          <AppValue
            title={neuron.description}
            data={response.content}
            onReload={onReload}
          />
        )}
      </div>
    </>
  );
};
export default NeuronResponse;

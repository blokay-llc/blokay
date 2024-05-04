"use client";
export default function NeuronAPIDoc({ neuron }: any) {
  if (!neuron) return <></>;

  let form = neuron.filters.fields.reduce((ac: any, item: any) => {
    ac[item.name] = item.type;
    return ac;
  }, {});
  let req = {
    neuronKey: neuron.key,
    form: form,
  };
  return (
    <div
      className="   rounded-xl relative overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(rgb(13, 13, 13), rgb(29, 29, 29))",
      }}
    >
      <div
        className="px-3 lg:px-10 py-3 lg:py-10  bg-cover bg-top  "
        style={{ backgroundImage: "url(/bg-blue.png)" }}
      >
        <div className=" z-10 relative px-5 py-5 rounded-2xl text-white">
          <h2 className="font-bold text-3xl mb-5">
            ¿Are you a developer? <br />
            Use this block in your project
          </h2>
          <div className="flex items-center gap-2  mb-3 ">
            <div className="text-yellow-600 text-xs bg-yellow-300 inline-block py-1 px-1 rounded-lg">
              POST
            </div>

            <div className="font-light">
              {process.env.NEXT_PUBLIC_URL}/api/brain/exec
            </div>
          </div>
          <pre className="bg-white/60 backdrop-blur-sm max-w-96 px-3 py-3 rounded-lg text-stone-800 ">
            <div className="text-stone-200 text-xs bg-stone-500  inline-block mb-3 py-1 px-1 rounded-lg">
              REQUEST
            </div>
            <div className="font-light text-sm">
              {JSON.stringify(req, null, 2)}
            </div>
          </pre>
        </div>
      </div>
    </div>
  );
}

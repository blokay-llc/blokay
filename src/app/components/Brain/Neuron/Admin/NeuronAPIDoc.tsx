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
    <div className="border-stone-200 border-2 px-3 lg:px-10 py-3 lg:py-10 rounded-xl">
      <h2 className="font-bold mb-5">Use this block in your project</h2>
      <div className="flex items-center gap-2  mb-3 ">
        <div className="text-stone-600 text-xs bg-stone-300 inline-block py-1 px-1 rounded-lg">
          POST
        </div>

        <div>{process.env.NEXT_PUBLIC_URL}/api/brain/exec</div>
      </div>
      <pre className="bg-stone-300 px-3 py-3 rounded-lg text-stone-800 max-w-96">
        <div className="text-stone-200 text-xs bg-stone-500  inline-block mb-3 py-1 px-1 rounded-lg">
          REQUEST
        </div>
        <div className="font-light text-sm">{JSON.stringify(req, null, 2)}</div>
      </pre>
    </div>
  );
}

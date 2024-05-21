"use client";
import { useState } from "react";
import { DS } from "@blokay/react";
function BoxIntegration({ title, icon = "", iconTool = "", children }: any) {
  const [showing, setShowing] = useState(false);
  return (
    <div className="select-none">
      <div
        className={`border-stone-200  dark:border-stone-800 border px-5 py-3 rounded-lg flex flex-col gap-5 ${
          showing ? "bg-stone-800" : "dark:hover:bg-white/10"
        }`}
      >
        <div
          className="flex items-center gap-3 "
          onClick={() => setShowing(!showing)}
        >
          <div>
            {iconTool && (
              <DS.IconTools icon={iconTool} className="size-8 fill-white" />
            )}
            {icon && <DS.Icon icon={icon} className="size-8 fill-white" />}
          </div>
          <div>{title}</div>
        </div>

        {showing && (
          <div
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

function ComingSoon() {
  return (
    <div className="py-5 text-center">
      <h2 className="dark:text-stone-600 text-stone-400 text-xl">
        Coming Soon
      </h2>
    </div>
  );
}
export default function NeuronAPIDoc({ neuron }: any) {
  if (!neuron) return <></>;

  let fields = neuron.filters?.fields || [];
  let form = fields.reduce((ac: any, item: any) => {
    ac[item.name] = item.type;
    return ac;
  }, {});
  let req = {
    neuronKey: neuron.key,
    form: form,
  };
  return (
    <div className="flex flex-col gap-3 mt-5">
      <BoxIntegration icon="api" title="Connect by API">
        <div className=" py-3 select-text   ">
          <div className="flex items-center gap-2  mb-3 ">
            <div className="text-yellow-600 text-xs bg-yellow-300 inline-block py-1 px-1 rounded-lg">
              POST
            </div>

            <div className="font-light">
              {process.env.NEXT_PUBLIC_URL}/api/brain/exec
            </div>
          </div>
          <pre className="bg-stone-900 backdrop-blur-sm max-w-96 px-3 py-3 rounded-lg text-stone-300 ">
            <div className="text-stone-200 text-xs bg-stone-500  inline-block mb-3 py-1 px-1 rounded-lg">
              REQUEST
            </div>
            <div className="font-light text-sm select-text">
              {JSON.stringify(req, null, 2)}
            </div>
          </pre>
        </div>
      </BoxIntegration>
      <BoxIntegration iconTool="react" title="Connect with React">
        <ComingSoon />
      </BoxIntegration>
      <BoxIntegration iconTool="vue" title="Connect with Vue">
        <ComingSoon />
      </BoxIntegration>
      <BoxIntegration iconTool="angular" title="Connect with Angular">
        <ComingSoon />
      </BoxIntegration>
      <BoxIntegration iconTool="html" title="Connect with HTML">
        <ComingSoon />
      </BoxIntegration>
    </div>
  );
}

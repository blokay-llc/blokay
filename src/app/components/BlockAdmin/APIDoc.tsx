"use client";
import { useState } from "react";
import { DS } from "@blokay/react";
import Editor from "@monaco-editor/react";

function BoxIntegration({ title, icon = "", iconTool = "", children }: any) {
  const [showing, setShowing] = useState(false);
  return (
    <div className="select-none">
      <div
        className={`border-neutral-200  dark:border-neutral-800 border px-5 py-3 rounded-lg flex flex-col gap-5 ${
          showing
            ? "bg-neutral-200 dark:bg-[#21252b]"
            : "dark:hover:bg-white/10"
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
      <h2 className="dark:text-neutral-600 text-neutral-400 text-xl">
        Coming Soon
      </h2>
    </div>
  );
}
export default function BlockAPIDoc({ block }: any) {
  if (!block) return <></>;

  let fields = block.filters?.fields || [];
  let form = fields.reduce((ac: any, item: any) => {
    ac[item.name] = item.type;
    return ac;
  }, {});
  let req = {
    block: block.key,
    form: form,
  };

  const reactContent = `
import { Block } from "@blokay/react";

function Component() {
  const form = ${JSON.stringify(form, null, 4)};
  return <Block
            block="${block.key}"
            defaultForm={form}
            autoExecute={false}
        />
}`;

  function setEditorTheme(monaco: any) {
    monaco.editor.defineTheme("onedark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        {
          token: "comment",
          foreground: "#5d7988",
          fontStyle: "italic",
        },
        { token: "constant", foreground: "#e06c75" },
      ],
      colors: {
        "editor.background": "#21252b",
      },
    });
  }

  return (
    <div className="flex flex-col gap-3 mt-5">
      <BoxIntegration icon="api" title="Connect by API">
        <div className="">
          <div className="flex items-center gap-2  mb-5  py-3 select-text   ">
            <div className="text-blue-700 text-xs bg-blue-300 inline-block py-1 px-1 rounded-lg">
              POST
            </div>

            <div className="font-light">
              {process.env.NEXT_PUBLIC_URL}/api/brain/exec
            </div>
          </div>
          <Editor
            options={{
              insertSpaces: true,
              tabSize: 4,
              fontSize: 16,
              minimap: {
                enabled: false,
              },
              wordWrap: "on",
              readOnly: true,
            }}
            beforeMount={setEditorTheme}
            theme="onedark"
            height="200px"
            defaultLanguage="json"
            value={JSON.stringify(req, null, 2)}
          />
        </div>
      </BoxIntegration>
      <BoxIntegration iconTool="react" title="Connect with React">
        <div className="h-64">
          <Editor
            options={{
              insertSpaces: true,
              tabSize: 4,
              fontSize: 14,
              minimap: {
                enabled: false,
              },
              wordWrap: "on",
              readOnly: true,
            }}
            beforeMount={setEditorTheme}
            theme="onedark"
            height="100%"
            defaultLanguage="typescript"
            value={reactContent}
          />
        </div>
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

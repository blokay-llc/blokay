"use client";
import { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { DS } from "@blokay/react";
import { updateNeuron } from "@/app/services/brain";

type Props = {
  block: any;
  reload: () => void;
};
export default function EditorApp({ block, reload }: Props) {
  const editorRef: any = useRef(null);
  const [form, setForm] = useState({ synapse: block?.synapse });
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleChange() {
    let code = editorRef.current?.getValue();
    setDiagnostics([]);
    setForm({ ...form, synapse: code });
  }

  function handleMount(editor: any) {
    editorRef.current = editor;
    editorRef.current.onDidChangeModelContent(handleChange);
  }

  const saveChanges = () => {
    setLoading(true);
    updateNeuron({
      neuronId: block.id,
      synapse: form.synapse,
    })
      .then((result) => {
        reload && reload();
        setDiagnostics(result.diagnostics);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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

    fetch("/types.d.ts")
      .then((res) => res.text())
      .then((txt) => {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(txt, "");
      });
  }

  useEffect(() => {
    setForm({ ...form, synapse: block?.synapse });
  }, [block]);

  return (
    <div
      className=" p-2 rounded-3xl overflow-hidde lg:h-[32rem]"
      style={{ backgroundColor: "#21252b" }}
    >
      {block?.synapse != undefined && (
        <>
          {diagnostics.length > 0 && (
            <div>
              {diagnostics.map((d: any, k: number) => (
                <div
                  key={k}
                  className="bg-gray-900 text-red-600 text-sm mb-3 rounded-lg py-1 px-3"
                >
                  {d.messageText}
                </div>
              ))}
            </div>
          )}

          <Editor
            options={{
              insertSpaces: true,
              tabSize: 4,
              fontSize: 14,
              minimap: {
                enabled: false,
              },
              wordWrap: "on",
            }}
            onMount={handleMount}
            beforeMount={setEditorTheme}
            theme="onedark"
            height="100%"
            defaultLanguage="typescript"
            value={block.synapse}
          />
          {form.synapse != block.synapse && (
            <div className="absolute top-2 right-0">
              <DS.Button
                text="Guardar"
                onClick={() => saveChanges()}
                loading={loading}
                icon="save"
                variant="primary"
                className="w-full"
                size="sm"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

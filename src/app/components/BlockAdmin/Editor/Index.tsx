"use client";
import { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { DS } from "@blokay/react";
import { updateBlock } from "@/app/services/brain";
import theme from "./theme.json" assert { type: "json" };

type Props = {
  block: any;
  reload: () => void;
};
export default function EditorApp({ block, reload }: Props) {
  const editorRef: any = useRef(null);
  const [form, setForm] = useState({ synapse: block?.synapse });
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [textTypes, setTextTypes] = useState("");

  function handleChange() {
    let code = editorRef.current?.getValue();
    setDiagnostics([]);
    setForm({ ...form, synapse: code });
  }

  function handleMount(editor: any) {
    editorRef.current = editor;
    editorRef.current.onDidChangeModelContent(handleChange);
  }

  function getTypes() {
    return fetch("/types.d.ts")
      .then((res) => res.text())
      .then((txt) => {
        setTextTypes(txt);
      });
  }
  const saveChanges = () => {
    setLoading(true);
    updateBlock({
      blockId: block.id,
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
    monaco.editor.defineTheme("themeEditor", theme);
    monaco.editor.setTheme("themeEditor");
    // monaco.editor.getModels()[0].updateOptions({ tabSize: 4, indentSize: 4 });

    monaco.languages.typescript.typescriptDefaults.addExtraLib(textTypes, "");
  }

  useEffect(() => {
    setForm({ ...form, synapse: block?.synapse });
  }, [block]);

  useEffect(() => {
    getTypes();
  }, []);

  if (!textTypes || block?.synapse == undefined) {
    return;
  }

  return (
    <div
      className="  rounded-3xl overflow-hidde lg:h-[32rem]"
      style={{ backgroundColor: "#fff" }}
    >
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
          fontSize: 15,
          lineHeight: 20,
          fontWeight: "400",
          fontFamily: "'JetBrains Mono', 'sans-serif', monospace",
          minimap: {
            enabled: false,
          },
          wordWrap: "wordWrapColumn",
          wordWrapColumn: 70,
        }}
        onMount={handleMount}
        beforeMount={setEditorTheme}
        theme="themeEditor"
        height="100%"
        defaultLanguage="typescript"
        value={block.synapse}
      />
      {form.synapse != block.synapse && (
        <div className="absolute top-1 right-0">
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
    </div>
  );
}

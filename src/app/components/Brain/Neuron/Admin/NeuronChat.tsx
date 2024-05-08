"use client";
import { useState, useEffect, useRef } from "react";
import TyperPrompt from "@/app/components/TyperPrompt";
import { AppIcon } from "@/app/components/DS/Index";
import { rewriteFn } from "@/app/services/brain";

const NeuronChat = ({ neuron, reload }: any) => {
  const messagesEndRef: any = useRef();
  const [form, setForm]: any = useState({});
  const [historyChat, setHistoryChat]: any[] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRewriteFn = () => {
    setLoading(true);
    setForm({ prompt: "" });

    setHistoryChat((prevArray: any[]) => [
      ...prevArray,
      {
        message: form.prompt,
        type: "user",
      },
    ]);

    rewriteFn({
      ...form,
      neuronId: neuron.id,
    })
      .then(() => {
        setHistoryChat((prevArray: any) => [
          ...prevArray,
          {
            message: "Ok",
            type: "system",
          },
        ]);
        reload && reload();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const scrollToChatBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToChatBottom();
  }, [historyChat]);

  useEffect(() => {
    if (neuron?.history) setHistoryChat(neuron.history);
  }, [neuron]);

  return (
    <div>
      {historyChat.length > 0 && (
        <div className="h-64 overflow-y-auto">
          {historyChat.map((chat: any, k: number) => (
            <div
              key={"chat-" + k}
              className="font-light pb-3 border-b border-stone-200 dark:border-stone-800 mb-3 flex items-center gap-3 dark:text-stone-400"
            >
              <div
                className={`select-none size-8 flex items-center justify-center rounded-full shrink-0	 ${
                  chat.type == "system"
                    ? "bg-stone-100"
                    : "bg-yellow-500 text-yellow-700"
                }`}
              >
                {chat.type == "system" && (
                  <img src="/logo-sm.svg" className="size-5" />
                )}
                {chat.type != "system" && <div className="text-sm">JR</div>}
              </div>
              <div>{chat.message}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {historyChat.length == 0 && neuron?.id && (
        <div className="font-light border mx-10 mb-10  mt-10 border-transparent rounded-xl px-5 py-10 text-black bg-gradient-to-r from-[#f4def6] to-[#d7ecf8] dark:from-[#362230] dark:to-[#122441] dark:text-white  ">
          <div className="text-sm">
            You can directly request our artificial intelligence to build the
            blocks for you. It's capable of making connections with databases,
            editing values, and connecting APIs.
          </div>
          <ul className="font-bold pl-5 mt-5 flex flex-col gap-3">
            <li className="flex gap-1 items-center">
              <AppIcon icon="right" className="size-5 fill-black" />
              <div>Create a report of inactive users.</div>
            </li>
            <li className="flex gap-1 items-center">
              <AppIcon icon="right" className="size-5 fill-black" />
              <div>Create a sales graph.</div>
            </li>
            <li className="flex gap-1 items-center">
              <AppIcon icon="right" className="size-5 fill-black" />
              <div>
                Connect to the internet's Pokédex API and display the results in
                a table.
              </div>
            </li>
          </ul>
        </div>
      )}
      <TyperPrompt
        loading={loading}
        onChange={(val: string) => {
          setForm({ ...form, prompt: val });
        }}
        value={form.prompt}
        onGenerate={() => {
          if (!form.prompt || loading) {
            return;
          }
          fetchRewriteFn();
        }}
      />
    </div>
  );
};
export default NeuronChat;

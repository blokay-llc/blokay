"use client";
import { useState, useEffect } from "react";
import { AppIcon } from "@/app/components/DS/Index";
import { getNeuronAdmin } from "@/app/services/brain";
import Editor from "@/app/components/Brain/Admin/Editor/Index";
import NeuronAPI from "./NeuronAPI";
import NeuronChat from "./NeuronChat";
import NeuronGeneral from "./NeuronGeneral";

const NeuronAdmin = ({ neuron, changeColorModal, reload, onClose }: any) => {
  const [view, setView] = useState("chat");
  const [neuronAdmin, setNeuronAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNeuron = () => {
    if (loading) return;
    setLoading(true);
    getNeuronAdmin(neuron.id)
      .then((n) => {
        setNeuronAdmin(n);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const init = (v: string) => {
    fetchNeuron();
    changeColorModal(["code"].includes(v) ? "#21252b" : "white");
  };

  const setViewPage = (v: string) => {
    setView(v);
    init(v);
  };

  useEffect(() => {
    init(view);
  }, [neuron]);

  return (
    <div className="relative">
      <div className="flex justify-center">
        <div className={`tabs ${["code"].includes(view) ? "dark" : ""}`}>
          <div
            onClick={() => setViewPage("general")}
            className={`tab ${view == "general" ? "active" : ""}`}
          >
            <AppIcon icon="general" />
            <div>General</div>
          </div>

          <div
            onClick={() => setViewPage("chat")}
            className={`tab ${view == "chat" ? "active" : ""}`}
          >
            <AppIcon icon="wizard" />
            <div>Chat</div>
          </div>

          <div
            onClick={() => setViewPage("code")}
            className={`tab ${view == "code" ? "active" : ""}`}
          >
            <AppIcon icon="developer" />
            <div>Code</div>
          </div>

          <div
            onClick={() => setViewPage("api")}
            className={`tab ${view == "api" ? "active" : ""}`}
          >
            <AppIcon icon="api" />
          </div>
        </div>
      </div>
      {view == "code" && (
        <Editor
          neuron={neuronAdmin}
          reload={() => {
            fetchNeuron();
          }}
        />
      )}
      {view == "general" && (
        <NeuronGeneral reload={reload} neuron={neuronAdmin} onClose={onClose} />
      )}
      {view == "chat" && <NeuronChat reload={reload} neuron={neuronAdmin} />}

      {view == "api" && <NeuronAPI reload={reload} neuron={neuronAdmin} />}
    </div>
  );
};
export default NeuronAdmin;

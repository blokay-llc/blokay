"use client";
import { useState, useEffect } from "react";
import { AppIcon } from "@/app/components/DS/Index";
import { getNeuronAdmin } from "@/app/services/brain";
import Editor from "@/app/components/Brain/Neuron/Admin/Editor/Index";
import NeuronAPI from "./NeuronAPI";
import NeuronChat from "./NeuronChat";
import NeuronGeneral from "./NeuronGeneral";

const NeuronAdmin = ({ neuron, changeColorModal, reload }: any) => {
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

  const setViewPage = (view: string) => {
    fetchNeuron();
    setView(view);
    changeColorModal(view == "code" ? "#21252b" : "#fff");
  };

  useEffect(() => {
    changeColorModal(view == "code" ? "#21252b" : "#fff");
    fetchNeuron();
  }, [neuron]);

  return (
    <div className="relative">
      <div className="flex justify-center">
        <div className={`tabs ${view == "code" ? "dark" : ""}`}>
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
        <NeuronGeneral reload={reload} neuron={neuronAdmin} />
      )}
      {view == "chat" && <NeuronChat reload={reload} neuron={neuronAdmin} />}

      {view == "api" && <NeuronAPI reload={reload} neuron={neuronAdmin} />}
    </div>
  );
};
export default NeuronAdmin;

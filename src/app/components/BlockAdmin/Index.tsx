"use client";
import { useState, useEffect } from "react";
import { DS } from "@blokay/react";
import { getNeuronAdmin } from "@/app/services/brain";
import Editor from "@/app/components/BlockAdmin/Editor/Index";
import API from "./API";
import Chat from "./Chat";
import General from "./General";
import UpgradePlan from "../UI/UpgradePlan";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function Tab({ view, viewPage, setViewPage, title, icon }: any) {
  return (
    <div
      onClick={() => setViewPage(viewPage)}
      className={`tab ${view == viewPage ? "active" : ""}`}
    >
      <DS.Icon icon={icon} />
      <div>{title}</div>
    </div>
  );
}
const NeuronAdmin = ({
  views,
  neuron,
  changeColorModal,
  reload,
  onClose,
}: any) => {
  const router = useRouter();
  const { data: session }: any = useSession();
  const [view, setView] = useState("chat");
  const [neuronAdmin, setNeuronAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const isAdmin = session?.user?.rol == "admin";

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

  const viewsCount = () => {
    if (views.length <= 0) return 0;
    return views.reduce((acc: any, view: any) => {
      return (acc += view.Views.length);
    }, 0);
  };

  const onLimit = () => {
    if (session?.business?.addedCard) return false;
    return viewsCount() >= session?.business?.limitViews;
  };

  const canEdit = () => {
    return isAdmin && !onLimit() && session?.business?.addedCard;
  };

  if (!canEdit()) {
    return (
      <UpgradePlan
        onClick={() => {
          onClose && onClose();
          return router.push("/dashboard/billing");
        }}
      />
    );
  }

  return (
    <div className="relative">
      <div className="flex justify-center">
        <div className={`tabs ${["code"].includes(view) ? "dark" : ""}`}>
          <Tab
            view={view}
            viewPage="general"
            setViewPage={setViewPage}
            title="General"
            icon="general"
          />
          <Tab
            view={view}
            viewPage="chat"
            setViewPage={setViewPage}
            title="Chat"
            icon="wizard"
          />
          <Tab
            view={view}
            viewPage="code"
            setViewPage={setViewPage}
            title="Code"
            icon="developer"
          />

          <div
            onClick={() => setViewPage("api")}
            className={`tab ${view == "api" ? "active" : ""}`}
          >
            <DS.Icon icon="api" />
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
        <General reload={reload} neuron={neuronAdmin} onClose={onClose} />
      )}
      {view == "chat" && <Chat reload={reload} neuron={neuronAdmin} />}

      {view == "api" && <API reload={reload} neuron={neuronAdmin} />}
    </div>
  );
};
export default NeuronAdmin;

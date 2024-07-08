"use client";
import { useState, useEffect } from "react";
import { DS } from "@blokay/react";
import { getBlockAdmin } from "@/app/services/brain";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UpgradePlan from "../../dashboard/billing/components/UpgradePlan";
import Editor from "@/app/components/BlockAdmin/Editor/Index";
import API from "./API";
import Chat from "./Chat";
import General from "./General";
import Metrics from "./Metrics";

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

type Props = {
  views: string[];
  block: any;
  changeColorModal: (color: string) => void;
  reload: () => void;
  onClose: () => void;
  jwt: string;
};
export default function BlockAdmin(props: Props) {
  const router = useRouter();
  const { data: session }: any = useSession();
  const [view, setView] = useState("chat");
  const [blockAdmin, setBlockAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const isAdmin = session?.user?.rol == "admin";

  const fetchBlock = () => {
    if (loading) return;
    setLoading(true);
    getBlockAdmin(props.block.id)
      .then((n) => {
        setBlockAdmin(n);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const setViewPage = (v: string) => {
    setView(v);
    fetchBlock();
  };

  useEffect(() => {
    fetchBlock();
  }, [props.block]);

  const viewsCount = () => {
    if (props.views.length <= 0) return 0;
    return props.views.reduce((acc: any, view: any) => {
      return (acc += view.Views.length);
    }, 0);
  };

  const onLimit = () => {
    if (session?.business?.addedCard) return false;
    return viewsCount() >= session?.business?.limitViews;
  };

  const canEdit = () => {
    return (isAdmin && !onLimit()) || session?.business?.addedCard;
  };

  if (!canEdit()) {
    return (
      <UpgradePlan
        onClick={() => {
          props.onClose && props.onClose();
          return router.push("/dashboard/billing");
        }}
      />
    );
  }

  return (
    <div className="relative">
      <div className="flex justify-center">
        <div className="tabs">
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
          <div
            onClick={() => setViewPage("metrics")}
            className={`tab ${view == "metrics" ? "active" : ""}`}
          >
            <DS.Icon icon="view" />
          </div>
        </div>
      </div>
      {view == "code" && (
        <Editor
          block={blockAdmin}
          reload={() => {
            fetchBlock();
          }}
        />
      )}
      {view == "general" && (
        <General
          reload={props.reload}
          block={blockAdmin}
          onClose={props.onClose}
        />
      )}
      {view == "chat" && <Chat reload={props.reload} block={blockAdmin} />}

      {view == "api" && <API reload={props.reload} block={blockAdmin} />}

      {view == "metrics" && (
        <Metrics reload={props.reload} block={blockAdmin} jwt={props.jwt} />
      )}
    </div>
  );
}

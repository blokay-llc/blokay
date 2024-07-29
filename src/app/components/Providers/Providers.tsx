"use client";

import { WorkspaceProvider } from "./Workspace";
import SessionProvider from "./Session";

export default function Providers({ children }: any) {
  return (
    <SessionProvider>
      <WorkspaceProvider>{children}</WorkspaceProvider>
    </SessionProvider>
  );
}

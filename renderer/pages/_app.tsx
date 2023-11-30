import React from "react";
import type { AppProps } from "next/app";
import { NextUIProvider, cn } from "@nextui-org/react";
import "../styles/globals.css";
import { FolderProvider } from "../hooks/folder-context";
import { Sidebar } from "../components/Sidebar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FolderProvider>
      <NextUIProvider>
        <div className="flex gap-2">
          <Sidebar />
          <Component {...pageProps} />
        </div>
      </NextUIProvider>
    </FolderProvider>
  );
}

export default MyApp;

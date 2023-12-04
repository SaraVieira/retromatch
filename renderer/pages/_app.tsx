import React from "react";
import type { AppProps } from "next/app";
import { NextUIProvider, cn } from "@nextui-org/react";
import "../styles/globals.css";
import { FolderProvider } from "../hooks/folder-context";
import Header from "../components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FolderProvider>
      <NextUIProvider>
        <Header />
        <div className="flex gap-2 min-h-screen">
          <Component {...pageProps} />
        </div>
      </NextUIProvider>
    </FolderProvider>
  );
}

export default MyApp;

import React from "react";
import type { AppProps } from "next/app";
import { NextUIProvider, cn } from "@nextui-org/react";
import "../styles/globals.css";
import { FolderProvider } from "../hooks/folder-context";
import Header from "../components/Header";
import { RomProvider } from "../hooks/roms-context";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RomProvider>
      <FolderProvider>
        <NextUIProvider>
          <Header />
          <Toaster position="top-right" />
          <div className="flex gap-2 min-h-screen">
            <Component {...pageProps} />
          </div>
        </NextUIProvider>
      </FolderProvider>
    </RomProvider>
  );
}

export default MyApp;

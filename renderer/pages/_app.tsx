import React from "react";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import "../styles/globals.css";
import { FolderProvider } from "../hooks/folder-context";
import { RomProvider } from "../hooks/roms-context";
import "react-contexify/ReactContexify.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import dynamic from "next/dynamic";
import Sidebar from "../components/Sidebar";
import { BacklogProvider } from "../hooks/backlog-context";

const Toasts = dynamic(
  () => import("../components/Toasts").then((a) => a.Toasts),
  {
    ssr: false
  }
);

const Toaster = dynamic(
  () => import("react-hot-toast").then((a) => a.Toaster),
  {
    ssr: false
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BacklogProvider>
      <RomProvider>
        <FolderProvider>
          <NextUIProvider>
            <NextThemesProvider attribute="class" defaultTheme="dark">
              <Toaster
                position="top-right"
                toastOptions={{
                  className: "!bg-background !text-content4"
                }}
              />

              <Toasts />
              <div className="flex h-full items-stretch min-h-screen">
                <Sidebar />
                <div className="p-6 h-full max-w-[1280px] w-full mx-auto">
                  <Component {...pageProps} />
                </div>
              </div>
            </NextThemesProvider>
          </NextUIProvider>
        </FolderProvider>
      </RomProvider>
    </BacklogProvider>
  );
}

export default MyApp;

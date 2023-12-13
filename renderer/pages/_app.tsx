import React from "react";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import "../styles/globals.css";
import { FolderProvider } from "../hooks/folder-context";
import Header from "../components/Header";
import { RomProvider } from "../hooks/roms-context";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import dynamic from "next/dynamic";

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
    <RomProvider>
      <FolderProvider>
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <Header />
            <Toaster
              position="top-right"
              toastOptions={{
                className:
                  "!bg-background min-w-[150px] justify-start !text-zinc-400"
              }}
            />
            <div className="flex flex-col gap-2 min-h-screen max-w-[1280px] m-auto px-6">
              <Toasts />
              <Component {...pageProps} />
            </div>
          </NextThemesProvider>
        </NextUIProvider>
      </FolderProvider>
    </RomProvider>
  );
}

export default MyApp;

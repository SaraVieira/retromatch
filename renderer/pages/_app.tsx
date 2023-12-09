import React from "react";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import "../styles/globals.css";
import { FolderProvider } from "../hooks/folder-context";
import Header from "../components/Header";
import { RomProvider } from "../hooks/roms-context";
import { Toaster } from "react-hot-toast";
import { ThemeProvider as NextThemesProvider } from "next-themes";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RomProvider>
      <FolderProvider>
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <Header />
            <Toaster position="top-right" />
            <div className="flex flex-col gap-2 min-h-screen">
              <Component {...pageProps} />
            </div>
          </NextThemesProvider>
        </NextUIProvider>
      </FolderProvider>
    </RomProvider>
  );
}

export default MyApp;

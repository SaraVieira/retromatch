import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Button, ButtonGroup } from "@nextui-org/react";

export default function NextPage() {
  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-tailwindcss)</title>
      </Head>
      <div className="grid grid-col-1 text-2xl w-full text-center">
        <div>
          <img
            className="ml-auto mr-auto"
            src="/images/logo.png"
            alt="Logo image"
          />
        </div>
        <span>⚡ Nextron ⚡</span>
      </div>
      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Button>
          <Link href="/home">Go to home page</Link>
        </Button>
      </div>
    </React.Fragment>
  );
}

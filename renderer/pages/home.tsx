import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-tailwindcss)</title>
      </Head>
      <div className="text-2xl w-full text-center">
        hi
        <Link href="/next">Go to next page</Link>
      </div>
    </React.Fragment>
  );
}

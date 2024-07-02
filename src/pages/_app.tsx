import type { AppProps } from "next/app";
import Head from "next/head";
import "../global.css";
import Navbar from "../components/Navbar";
import { SearchProvider } from "@/context/SearchContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SearchProvider>
      <Head>
        <title>Youtube Clone</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Youtube Clone" />
      </Head>
      <div className="container mx-auto">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </SearchProvider>
  );
}

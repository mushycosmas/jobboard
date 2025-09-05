import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "bootstrap/dist/css/bootstrap.min.css";

import UniversalDataProvider from "@/context/UniversalDataContext";  // Import your provider

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <UniversalDataProvider>   {/* Wrap the app with your provider */}
        <Component {...pageProps} />
      </UniversalDataProvider>
    </SessionProvider>
  );
}

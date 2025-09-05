"use client";

import { SessionProvider } from "next-auth/react";
import UniversalDataProvider from "../context/UniversalDataContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UniversalDataProvider>{children}</UniversalDataProvider>
    </SessionProvider>
  );
}

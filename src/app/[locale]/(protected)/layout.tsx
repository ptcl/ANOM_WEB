"use client";


import { AuthProvider } from "@/components/provider/AuthProvider";
import { AccentColorProvider } from "@/components/provider/AccentColorProvider";


export default function ProtectedLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {


  return (
    <AccentColorProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </AccentColorProvider>
  );
}
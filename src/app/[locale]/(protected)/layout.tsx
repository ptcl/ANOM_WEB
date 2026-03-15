"use client";


import { AuthProvider } from "@/components/provider/AuthProvider";
import { AccentColorProvider } from "@/components/provider/AccentColorProvider";
import { DragProvider } from "@/components/provider/DragProvider";
import { ResizeProvider } from "@/components/provider/ResizeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";


export default function ProtectedLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {


  return (
    <AccentColorProvider>
      <AuthProvider>
        <SidebarProvider>
          <ResizeProvider>
            <DragProvider>
              {children}
            </DragProvider>
          </ResizeProvider>
        </SidebarProvider>
      </AuthProvider>
    </AccentColorProvider>
  );
}
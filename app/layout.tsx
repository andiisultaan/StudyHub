import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import CollapsibleSidebar from "@/components/sidebar";
import SessionWrapper from "@/components/session-wrapper";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import Loading from "./loading";
import { MobileSidebar } from "@/components/mobile-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StudyHub",
  description: "Create personalized learning paths, join discussions, and master new skills with AI-guided education.",
  icons: {
    icon: "/study-hub.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionWrapper>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} min-h-screen`}>
          <div className="fixed inset-0 bg-gradient-to-br from-black via-purple-950 to-black animate-gradient-background"></div>
          <div className="relative z-10">
            <SidebarProvider defaultOpen={false}>
              <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                <CollapsibleSidebar />
                <MobileSidebar />
                <Suspense fallback={<Loading />}>{children}</Suspense>
                <Toaster />
              </ThemeProvider>
            </SidebarProvider>
          </div>
        </body>
      </html>
    </SessionWrapper>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { ReactLenis } from "@/utils/lenis";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "HostIT",
  description: "Manage your event seamlessly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ overflowY: "scroll" }}>
      <ReactLenis root>
        <body className={`bg-[#131939] antialiased text-text`}>
          <Toaster />
          {children}
        </body>
      </ReactLenis>
    </html>
  );
}

import type { Metadata } from "next";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import "./globals.css";
import { Providers } from "./providers";

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
    <html lang="en">
      <body className={`antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

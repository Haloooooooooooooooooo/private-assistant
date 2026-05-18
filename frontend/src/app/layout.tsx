import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Private Assistant",
  description: "Workflow-orchestrated multi-agent personal knowledge system"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

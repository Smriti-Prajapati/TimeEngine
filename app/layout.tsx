import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TimeEngine",
  description: "A beautiful interactive wall calendar — plan your days, capture your thoughts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

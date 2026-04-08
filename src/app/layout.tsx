import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/layout/Nav";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "foodo — Meal Planner",
  description: "Plan meals, scale recipes, generate shopping lists",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased font-sans">
        <Nav />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}

"use client";

import { BackToTop } from "@/components/ui/back-to-top";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <BackToTop />
    </>
  );
}

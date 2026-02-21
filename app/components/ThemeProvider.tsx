"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";
import { useTheme } from "next-themes";

function DaisyUIThemeSync() {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return null;
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      <DaisyUIThemeSync />
      {children}
    </NextThemesProvider>
  );
}

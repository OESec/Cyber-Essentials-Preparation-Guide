"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useTheme as useNextTheme } from "next-themes"

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// Replace the placeholder useTheme with the actual hook from next-themes
export function useTheme() {
  return useNextTheme()
}

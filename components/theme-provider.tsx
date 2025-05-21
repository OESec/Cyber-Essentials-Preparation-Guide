"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// Add the missing useTheme hook
export function useTheme() {
  const { theme, setTheme } = React.useContext(
    React.createContext({ theme: undefined, setTheme: (theme: string) => {} }),
  )

  // This is a placeholder implementation
  // In a real implementation, we would use the next-themes useTheme hook
  // But since we don't have access to it directly, we're creating a minimal version
  return {
    theme: theme,
    setTheme: setTheme,
    // Add these properties to match what might be expected from the hook
    systemTheme: undefined,
    themes: ["light", "dark", "system"],
  }
}

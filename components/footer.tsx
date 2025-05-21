"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Volume2, VolumeX } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function Footer() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize from localStorage once mounted
  useEffect(() => {
    setMounted(true)
    const storedMuted = localStorage.getItem("soundsMuted")
    if (storedMuted !== null) {
      setIsMuted(storedMuted === "true")
    }

    // Cleanup any lingering timeouts on unmount
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  // Handle theme toggle with visual animation
  const handleThemeToggle = () => {
    // Set animating state to trigger the visual effect
    setIsAnimating(true)

    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }

    // Set a timeout to stop the animation after 700ms
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false)
    }, 700)

    // Toggle the theme
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    console.log("Setting theme to:", newTheme)
  }

  // Handle mute toggle
  const handleMuteToggle = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    localStorage.setItem("soundsMuted", String(newMuted))
  }

  // Don't render the real buttons until client-side
  if (!mounted) {
    return (
      <footer className="py-8 text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
        <div className="container mx-auto flex flex-col items-center gap-4">
          <p className="text-base font-medium text-blue-800">Copyright 2025 | Idea of Edewede O. | 20th May 2025</p>
          <div className="flex items-center gap-2">
            <div className="h-9 w-[120px]"></div>
            <div className="h-9 w-9"></div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer
      className={`py-8 text-center transition-colors duration-500 ease-in-out relative
      ${
        theme === "dark"
          ? "bg-gradient-to-r from-gray-900 to-blue-900 border-t border-blue-800"
          : "bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100"
      }`}
    >
      {/* Visual animation overlay */}
      {isAnimating && (
        <div
          className={`absolute inset-0 pointer-events-none z-10 animate-fade-out
            ${theme === "dark" ? "bg-blue-200 bg-opacity-20" : "bg-blue-900 bg-opacity-10"}`}
        />
      )}

      <div className="container mx-auto flex flex-col items-center gap-4">
        <p
          className={`text-base font-medium transition-colors duration-500
          ${theme === "dark" ? "text-blue-200" : "text-blue-800"}`}
        >
          Copyright 2025 | Idea of Edewede O. | 20th May 2025
        </p>

        <div className="flex items-center gap-2">
          {/* Theme toggle button with animations */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleThemeToggle}
            className={`
              flex items-center gap-2 
              transition-all duration-300 ease-in-out
              transform hover:scale-105
              hover:shadow-md
              ${isAnimating ? "animate-pulse scale-105" : ""}
              ${
                theme === "dark"
                  ? "bg-blue-800 text-blue-100 hover:bg-blue-700 border-blue-700 hover:border-blue-500"
                  : "bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200 hover:border-blue-300"
              }
            `}
          >
            {theme === "dark" ? (
              <>
                <Sun
                  className={`h-4 w-4 transition-transform duration-500 ease-in-out 
                    ${isAnimating ? "animate-spin-slow" : "hover:rotate-12 hover:animate-pulse"}`}
                />
                <span className="relative overflow-hidden">
                  <span
                    className={`inline-block transition-transform duration-300 
                      ${isAnimating ? "animate-bounce-once" : "hover:-translate-y-1 hover:opacity-80"}`}
                  >
                    Light Mode
                  </span>
                </span>
              </>
            ) : (
              <>
                <Moon
                  className={`h-4 w-4 transition-transform duration-500 ease-in-out 
                    ${isAnimating ? "animate-spin-slow" : "hover:rotate-12 hover:animate-pulse"}`}
                />
                <span className="relative overflow-hidden">
                  <span
                    className={`inline-block transition-transform duration-300 
                      ${isAnimating ? "animate-bounce-once" : "hover:-translate-y-1 hover:opacity-80"}`}
                  >
                    Dark Mode
                  </span>
                </span>
              </>
            )}
          </Button>

          {/* Sound toggle button with animations */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleMuteToggle}
            aria-label={isMuted ? "Unmute sound effects" : "Mute sound effects"}
            className={`
              transition-all duration-300 ease-in-out
              transform hover:scale-105
              hover:shadow-md
              ${
                theme === "dark"
                  ? "bg-blue-800 text-blue-100 hover:bg-blue-700 border-blue-700 hover:border-blue-500"
                  : "bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200 hover:border-blue-300"
              }
            `}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 transition-transform duration-300 ease-in-out hover:scale-110" />
            ) : (
              <Volume2 className="h-4 w-4 transition-transform duration-300 ease-in-out hover:scale-110" />
            )}
          </Button>
        </div>
      </div>
    </footer>
  )
}

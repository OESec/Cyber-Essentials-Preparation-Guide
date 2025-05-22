import type React from "react"
import type { Metadata } from "next"
import { Work_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/footer"
import { ChatAssistant } from "@/components/chat-assistant"

const workSans = Work_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cyber Essentials Preparation Guide",
  description: "A practical guide for SMEs to prepare for Cyber Essentials certification",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${workSans.className} flex flex-col min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <main className="flex-grow">{children}</main>
          <Footer />
          <ChatAssistant />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

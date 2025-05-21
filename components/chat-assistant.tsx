"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  ChevronDown,
  ChevronUp,
  Bot,
  Trash2,
  RotateCcw,
  Square,
  Pause,
  Play,
} from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useLocalStorage } from "@/hooks/use-local-storage"
import {
  buildKnowledgeBase,
  searchKnowledgeBase,
  formatEntriesAsResponse,
  getContextFromPath,
  getProgressContext,
  getCommonResponse,
  getSuggestionsForSection,
} from "@/lib/rag-utils"

type Message = {
  role: "user" | "assistant"
  content: string
  isTyping?: boolean
  timestamp?: number
  isCanceled?: boolean
  isPaused?: boolean
}

// Typing animation component
const TypingIndicator = ({ theme }: { theme: string }) => (
  <div className="flex space-x-1 items-center justify-center p-1">
    <div
      className={`w-2 h-2 rounded-full ${
        theme === "dark" ? "bg-blue-400" : "bg-blue-600"
      } animate-bounce [animation-delay:-0.3s]`}
    ></div>
    <div
      className={`w-2 h-2 rounded-full ${
        theme === "dark" ? "bg-blue-400" : "bg-blue-600"
      } animate-bounce [animation-delay:-0.15s]`}
    ></div>
    <div className={`w-2 h-2 rounded-full ${theme === "dark" ? "bg-blue-400" : "bg-blue-600"} animate-bounce`}></div>
  </div>
)

const DEFAULT_WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi! I'm your Cyber Essentials assistant. I can help with the five technical controls, certification process, and specific requirements. How can I assist with your certification today?",
  timestamp: Date.now(),
}

export function ChatAssistant() {
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useLocalStorage<boolean>("cyberAssistantOpen", false)
  const [isMinimized, setIsMinimized] = useLocalStorage<boolean>("cyberAssistantMinimized", false)
  const [messages, setMessages] = useLocalStorage<Message[]>("cyberAssistantMessages", [DEFAULT_WELCOME_MESSAGE])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [currentTypingIndex, setCurrentTypingIndex] = useState(-1)
  const [displayedText, setDisplayedText] = useState("")
  const [fullResponseText, setFullResponseText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingSpeed = 15 // milliseconds per character
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [chatHeight, setChatHeight] = useLocalStorage<number>("cyberAssistantHeight", 450)
  const [chatWidth, setChatWidth] = useLocalStorage<number>("cyberAssistantWidth", 384) // 96rem default
  const [isResizing, setIsResizing] = useState(false)
  const resizeRef = useRef<HTMLDivElement>(null)
  const [knowledgeBase, setKnowledgeBase] = useState<ReturnType<typeof buildKnowledgeBase>>([])
  const [isExpanded, setIsExpanded] = useLocalStorage<boolean>("cyberAssistantExpanded", false)
  const [isCancellable, setIsCancellable] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Build knowledge base on client-side
  useEffect(() => {
    setKnowledgeBase(buildKnowledgeBase())
  }, [])

  // Function to get contextual suggestions based on the current URL path
  const getContextualSuggestions = () => {
    if (typeof window === "undefined") return []

    const path = window.location.pathname

    // Extract section ID from path
    const sectionMatch = path.match(/\/section\/([^/]+)/)
    if (sectionMatch) {
      return getSuggestionsForSection(sectionMatch[1])
    }

    // Default suggestions
    return [
      "What are the five technical controls?",
      "What's the difference between Cyber Essentials and CE Plus?",
      "How long does certification take?",
    ]
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isMinimized, displayedText])

  // Typing animation effect with pause/resume capability
  useEffect(() => {
    if (isTyping && currentTypingIndex >= 0 && !isPaused) {
      if (displayedText.length < fullResponseText.length) {
        typingTimeoutRef.current = setTimeout(() => {
          // Add the next character to the displayed text
          setDisplayedText(fullResponseText.substring(0, displayedText.length + 1))
        }, typingSpeed)

        // Set cancellable while typing
        setIsCancellable(true)

        return () => {
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
            typingTimeoutRef.current = null
          }
        }
      } else {
        // Typing is complete
        setIsTyping(false)
        setIsCancellable(false)
        setIsPaused(false)

        // Update the message with the full text
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages]
          updatedMessages[currentTypingIndex] = {
            ...updatedMessages[currentTypingIndex],
            content: fullResponseText,
            isTyping: false,
            isPaused: false,
          }
          return updatedMessages
        })

        setCurrentTypingIndex(-1)
      }
    }
  }, [isTyping, displayedText, fullResponseText, currentTypingIndex, isPaused, setMessages])

  // Handle pausing the response
  const handlePause = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }

    setIsPaused(true)

    // Update the message to indicate it's paused
    if (currentTypingIndex >= 0) {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages]
        updatedMessages[currentTypingIndex] = {
          ...updatedMessages[currentTypingIndex],
          isPaused: true,
        }
        return updatedMessages
      })
    }
  }

  // Handle resuming the response
  const handleResume = () => {
    setIsPaused(false)

    // Update the message to indicate it's no longer paused
    if (currentTypingIndex >= 0) {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages]
        updatedMessages[currentTypingIndex] = {
          ...updatedMessages[currentTypingIndex],
          isPaused: false,
        }
        return updatedMessages
      })
    }
  }

  // Handle canceling the response
  const handleCancel = () => {
    // Clear any ongoing typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }

    // Update the message to indicate cancellation
    if (currentTypingIndex >= 0) {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages]
        updatedMessages[currentTypingIndex] = {
          ...updatedMessages[currentTypingIndex],
          content: displayedText + " [Canceled]",
          isTyping: false,
          isCanceled: true,
          isPaused: false,
        }
        return updatedMessages
      })
    }

    // Reset states
    setIsTyping(false)
    setIsCancellable(false)
    setIsPaused(false)
    setCurrentTypingIndex(-1)
  }

  // Generate a response using pure RAG (no LLM)
  const generateResponse = (query: string): string => {
    // First, check if we have a common response for this query
    const commonResponse = getCommonResponse(query)
    if (commonResponse) {
      return commonResponse
    }

    // Get relevant entries from the knowledge base
    const relevantEntries = searchKnowledgeBase(query, knowledgeBase, 5)

    // Get contextual entries based on current path
    const contextEntries = getContextFromPath(window.location.pathname)

    // Get progress-related entries
    const progressEntries = getProgressContext()

    // Combine all entries, prioritizing direct search results
    const allEntries = [...relevantEntries]

    // Add context entries only if they're not already included
    contextEntries.forEach((entry) => {
      if (!allEntries.some((e) => e.id === entry.id)) {
        allEntries.push(entry)
      }
    })

    // Add progress entries only if they're not already included
    progressEntries.forEach((entry) => {
      if (!allEntries.some((e) => e.id === entry.id)) {
        allEntries.push(entry)
      }
    })

    // Format the entries into a readable response
    return formatEntriesAsResponse(allEntries, query)
  }

  const handleSend = async (manualInput?: string) => {
    const messageText = manualInput || input
    if (messageText.trim() === "") return

    const userMessage: Message = {
      role: "user",
      content: messageText,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Simulate a slight delay for a more natural feel
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Generate response using pure RAG
      const responseText = generateResponse(messageText)

      // Add a placeholder message for typing animation
      const newMessageIndex = messages.length
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
          isTyping: true,
          timestamp: Date.now(),
        },
      ])

      // Set up typing animation
      setFullResponseText(responseText)
      setDisplayedText("")
      setCurrentTypingIndex(newMessageIndex)
      setIsTyping(true)
      setIsCancellable(true)
      setIsPaused(false)
    } catch (error) {
      console.error("Error generating response:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm sorry, I encountered an error while searching for information. Please try again.",
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearConversation = () => {
    setMessages([DEFAULT_WELCOME_MESSAGE])
    setShowClearConfirm(false)
  }

  const resetConversation = () => {
    if (messages.length > 1) {
      setShowClearConfirm(true)
    }
  }

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return ""

    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const SuggestionChip = ({ suggestion, onClick }: { suggestion: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full mb-2 mr-2 transition-colors whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] ${
        theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-gray-200" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
      }`}
    >
      {suggestion}
    </button>
  )

  const startResize = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsResizing(true)

    // Capture initial positions
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = chatWidth
    const startHeight = chatHeight

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate new dimensions
      const newWidth = Math.max(320, Math.min(600, startWidth + (e.clientX - startX)))
      const newHeight = Math.max(300, Math.min(800, startHeight + (e.clientY - startY)))

      setChatWidth(newWidth)
      setChatHeight(newHeight)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  useEffect(() => {
    return () => {
      // Cleanup event listeners if component unmounts during resize
      if (isResizing) {
        document.removeEventListener("mousemove", () => {})
        document.removeEventListener("mouseup", () => {})
      }
    }
  }, [isResizing])

  const toggleExpanded = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsExpanded(!isExpanded)

    // When expanding, increase the size; when collapsing, return to previous size
    if (!isExpanded) {
      setChatWidth(Math.min(800, window.innerWidth * 0.8))
      setChatHeight(Math.min(700, window.innerHeight * 0.8))
    } else {
      // Return to default sizes
      setChatWidth(384)
      setChatHeight(450)
    }
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <Card
          className={`mb-2 shadow-lg transition-all duration-300 ease-in-out ${
            isMinimized ? `w-80 sm:w-96 h-14 overflow-hidden` : `overflow-hidden flex flex-col`
          } ${isMinimized ? "animate-pulse-subtle" : ""} ${isExpanded ? "fixed inset-4 m-auto z-50" : ""}`}
          style={{
            width: isMinimized ? "auto" : isExpanded ? "auto" : `${chatWidth}px`,
            height: isMinimized ? "3.5rem" : isExpanded ? "auto" : `${chatHeight}px`,
            cursor: isResizing ? "nwse-resize" : "auto",
            maxWidth: isExpanded ? "1200px" : undefined,
            maxHeight: isExpanded ? "80vh" : undefined,
          }}
        >
          <CardHeader
            className={`p-3 border-b flex flex-row items-center justify-between cursor-pointer chat-header-hover ${
              theme === "dark" ? "bg-gray-800" : "bg-blue-50"
            }`}
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <div className="flex items-center">
              <Bot className={`h-5 w-5 mr-2 ${theme === "dark" ? "text-blue-300" : "text-blue-600"}`} />
              <h3 className={`font-medium ${theme === "dark" ? "text-white" : "text-blue-700"}`}>
                Cyber Essentials Guide
              </h3>
            </div>
            <div className="flex items-center gap-1">
              {!isMinimized && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={toggleExpanded}
                    title={isExpanded ? "Collapse window" : "Expand window"}
                  >
                    {isExpanded ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <polyline points="4 14 10 14 10 20"></polyline>
                        <polyline points="20 10 14 10 14 4"></polyline>
                        <line x1="14" y1="10" x2="21" y2="3"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <polyline points="9 21 3 21 3 15"></polyline>
                        <line x1="21" y1="3" x2="14" y2="10"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                      </svg>
                    )}
                  </Button>
                </>
              )}
              {!isMinimized && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation()
                    resetConversation()
                  }}
                  title="Clear conversation"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMinimized(!isMinimized)
                }}
              >
                {isMinimized ? <ChevronUp className="h-4 w-4 animate-bounce" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(false)
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          {isMinimized && (
            <div className="px-3 py-1 text-xs text-gray-500 dark:text-gray-400 italic">Click to expand</div>
          )}

          {!isMinimized && (
            <>
              <CardContent className="p-3 overflow-y-auto flex-grow h-[330px] transition-all duration-300">
                {showClearConfirm ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <p className="text-center text-sm">Are you sure you want to clear this conversation?</p>
                    <div className="flex space-x-2">
                      <Button variant="destructive" size="sm" onClick={clearConversation} className="flex items-center">
                        <Trash2 className="h-4 w-4 mr-1" /> Clear
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user"
                              ? `${theme === "dark" ? "bg-blue-700 text-white" : "bg-blue-500 text-white"}`
                              : `${theme === "dark" ? "bg-gray-700 text-gray-100" : "bg-gray-100 text-gray-800"}`
                          }`}
                        >
                          {message.isTyping && index === currentTypingIndex ? (
                            <>
                              <p className="text-sm whitespace-pre-wrap">{displayedText}</p>
                              {!isPaused && <TypingIndicator theme={theme} />}
                              {isPaused && (
                                <div className="text-xs italic mt-1">{theme === "dark" ? "⏸ Paused" : "⏸ Paused"}</div>
                              )}
                            </>
                          ) : (
                            <>
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              {message.timestamp && (
                                <p
                                  className={`text-xs mt-1 text-right ${
                                    message.role === "user"
                                      ? "text-blue-200"
                                      : theme === "dark"
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                  }`}
                                >
                                  {formatTimestamp(message.timestamp)}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    {messages.length === 1 && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                        <div className="flex flex-wrap">
                          {getContextualSuggestions().map((suggestion, index) => (
                            <SuggestionChip
                              key={index}
                              suggestion={suggestion}
                              onClick={() => {
                                handleSend(suggestion)
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {messages.length === 1 && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md text-sm">
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>Note:</strong> This assistant searches the Cyber Essentials guide to find relevant
                          information. Ask any question about Cyber Essentials certification requirements or process.
                        </p>
                      </div>
                    )}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className={`rounded-lg p-3 ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                          <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </CardContent>

              <CardFooter className="p-3 border-t">
                <div className="flex w-full items-center gap-2">
                  <Input
                    placeholder="Ask about Cyber Essentials..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow"
                    disabled={isLoading || isTyping || showClearConfirm}
                  />
                  {isCancellable ? (
                    <div className="flex gap-1">
                      {isPaused ? (
                        <Button
                          size="icon"
                          onClick={handleResume}
                          className={
                            theme === "dark" ? "bg-green-700 hover:bg-green-600" : "bg-green-600 hover:bg-green-700"
                          }
                          title="Resume response"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="icon"
                          onClick={handlePause}
                          className={
                            theme === "dark" ? "bg-amber-700 hover:bg-amber-600" : "bg-amber-600 hover:bg-amber-700"
                          }
                          title="Pause response"
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        onClick={handleCancel}
                        className={theme === "dark" ? "bg-red-700 hover:bg-red-600" : "bg-red-600 hover:bg-red-700"}
                        title="Stop response"
                      >
                        <Square className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="icon"
                      onClick={() => handleSend()}
                      disabled={isLoading || isTyping || input.trim() === "" || showClearConfirm}
                      className={theme === "dark" ? "bg-blue-700 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"}
                    >
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </CardFooter>
            </>
          )}
          {!isMinimized && !isExpanded && (
            <div
              ref={resizeRef}
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-10"
              style={{
                backgroundImage: `radial-gradient(circle, ${theme === "dark" ? "#4B5563" : "#D1D5DB"} 2px, transparent 2px)`,
                backgroundSize: "8px 8px",
                backgroundPosition: "right bottom",
                backgroundRepeat: "no-repeat",
                opacity: 0.8,
                transform: "translate(-4px, -4px)",
              }}
              onMouseDown={startResize}
              title="Drag to resize"
            />
          )}
        </Card>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(!isOpen)}
              size="icon"
              className={`rounded-full shadow-md transition-transform duration-300 ${
                isOpen && isMinimized ? "animate-pulse-subtle" : ""
              } ${theme === "dark" ? "bg-blue-700 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{isOpen ? "Close guide" : "Get help with Cyber Essentials"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

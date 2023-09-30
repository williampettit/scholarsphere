"use client";

import { FunctionCallHandler } from "ai";
import { useChat } from "ai/react";
import { nanoid } from "nanoid";

import { siteConfig } from "@/config/site-config";

import { Icons } from "@/components/icons";
import { LoadingIndicator } from "@/components/loading-indicator";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { ChatMessage } from "@/app/(app)/(authenticated)/ai-chat/components/chat-message";

const EXAMPLE_QUESTIONS = [
  `What is ${siteConfig.name}?`,
  "What is my current GPA?",
  "What will my GPA be after this semester?",

  "How many credits have I completed?",
  "What assignments are coming up?",
  "What are my active courses?",

  // "Help me plan my upcoming week of assignments.",
  // "Who are you, where did you come from?",
  // "How can you help me, what is your purpose?",
];

export function AIChat() {
  const functionCallHandler: FunctionCallHandler = async (
    chatMessages,
    functionCall,
  ) => {
    console.log("chatMessages", chatMessages);
    console.log("functionCall", functionCall);
  };

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setInput,
    isLoading,
    error,
  } = useChat({
    api: "/api/ai/chat",
    experimental_onFunctionCall: functionCallHandler,
    initialMessages: [
      {
        id: nanoid(),
        role: "assistant",
        content: `Hello! I am the ${siteConfig.name} AI Assistant. How can I help you?`,
      },
    ],
  });

  return (
    <div className="flex flex-col space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {EXAMPLE_QUESTIONS.map((question) => (
          <Button key={question} onClick={() => setInput(question)}>
            {question}
          </Button>
        ))}
      </div>

      <form className="flex flex-row space-x-4" onSubmit={handleSubmit}>
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Enter your message here..."
        />

        <Button type="submit" disabled={isLoading}>
          Send
        </Button>
      </form>

      {error ? (
        <Card>
          <CardHeader>
            <div className="text-md flex items-center justify-center text-muted-foreground">
              <Icons.WarningTriangle className="mr-2 h-4 w-4" />
              Error: {error.message}
            </div>
          </CardHeader>
        </Card>
      ) : null}

      {isLoading ? (
        <LoadingIndicator>Getting response...</LoadingIndicator>
      ) : null}

      <div className="flex flex-col-reverse gap-6">
        {messages.length > 0
          ? messages.map((message, idx) => (
              <ChatMessage
                key={message.id}
                index={idx + 1}
                content={message.content}
                role={message.role}
                createdAt={message.createdAt}
              />
            ))
          : null}
      </div>
    </div>
  );
}

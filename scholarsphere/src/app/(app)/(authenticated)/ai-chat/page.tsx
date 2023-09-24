import { AIChat } from "@/app/(app)/(authenticated)/ai-chat/components/chat";

export default async function AIChatPage() {
  // TEMP: wait 10s
  // await new Promise((resolve) => setTimeout(resolve, 10000));

  return (
    <>
      <AIChat />
    </>
  );
}

import { ChatMessage, ChatMessages, useChatUI } from "@llamaindex/chat-ui";
import Image from "next/image";

function CustomChatMessages() {
  const { messages, isLoading, append } = useChatUI();

  return (
    <ChatMessages>
      <ChatMessages.List className="px-4 py-6">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isLast={index === messages.length - 1}
            className="mb-4"
          >
            {!isLoading && (
              <div className="bg-background flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border">
                <Image
                  src="/favicon.ico"
                  width={40}
                  height={40}
                  className="border-1 rounded-full border-transparent"
                  alt={"Assistant profile image"}
                />
              </div>
            )}

            <ChatMessage.Content isLoading={isLoading} append={append}>
              <ChatMessage.Content.Markdown />
              <ChatMessage.Content.Source />
              <ChatMessage.Content.SuggestedQuestions />
            </ChatMessage.Content>
            <ChatMessage.Actions />
          </ChatMessage>
        ))}
        <ChatMessages.Empty
          heading="Hello there!"
          subheading="I'm here to help you with your questions."
        />
        <ChatMessages.Loading />
      </ChatMessages.List>
    </ChatMessages>
  );
}

export default CustomChatMessages;

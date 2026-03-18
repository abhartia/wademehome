import { useChatUI } from "@llamaindex/chat-ui";

export const QuestionSuggestions = ({
  suggestions
}: {suggestions?: string[]}) => {
  const { messages, append } = useChatUI();

  if (!suggestions)
    return <></>;

  return messages.length === 0 && (
    <div className="flex flex-col gap-2 px-4 basis-[230px]">
      {
        suggestions.map(
          (question) =>
          <button
            className="border p-3 rounded text-sm cursor-pointer border-input text-left"
            key={question}
            onClick={() => append({
              role: "user",
              content: question
            })}
          >{question}</button>
        )
      }
    </div>
  )
}
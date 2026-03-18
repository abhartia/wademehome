import { ChatSection } from "@/components/chat";
import { Toaster } from "@/components/ui/sonner";

export default function SearchPage() {
  const chatUrl = process.env.NEXT_PUBLIC_CHAT_API_URL + "/listings/chat";

  return (
    <div className="h-[calc(100vh-3rem)] font-sans">
      <ChatSection chatUrl={chatUrl} />
      <Toaster richColors closeButton={true} duration={Infinity} />
    </div>
  );
}

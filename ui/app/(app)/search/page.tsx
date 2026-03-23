import { AppSearchClient } from "./AppSearchClient";
import { Toaster } from "@/components/ui/sonner";

export default function SearchPage() {
  return (
    <div className="h-[calc(100dvh-3rem)] overflow-hidden font-sans">
      <AppSearchClient />
      <Toaster richColors closeButton={true} duration={Infinity} />
    </div>
  );
}

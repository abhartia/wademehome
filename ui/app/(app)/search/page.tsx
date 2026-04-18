import { AppSearchClient } from "./AppSearchClient";

export default function SearchPage() {
  return (
    <div className="h-[calc(100dvh-3rem)] overflow-hidden font-sans">
      <AppSearchClient />
    </div>
  );
}

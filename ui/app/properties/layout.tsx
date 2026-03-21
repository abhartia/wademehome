import { PublicListingTopBar } from "@/components/navigation/PublicListingTopBar";

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicListingTopBar />
      {children}
    </div>
  );
}

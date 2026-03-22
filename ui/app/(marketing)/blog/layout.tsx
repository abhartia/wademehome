import { MarketingPublicHeader } from "@/components/navigation/MarketingPublicHeader";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingPublicHeader />
      {children}
    </div>
  );
}

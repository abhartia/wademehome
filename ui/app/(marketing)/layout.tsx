/**
 * Public / marketing routes only. Authenticated app chrome lives in `(app)/layout.tsx` (wadecv-style route groups).
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="min-h-screen">{children}</main>;
}

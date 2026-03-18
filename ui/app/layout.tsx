import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { UserProfileProvider } from "@/components/providers/UserProfileProvider";
import { RoommateProvider } from "@/components/providers/RoommateProvider";
import { ToursProvider } from "@/components/providers/ToursProvider";
import { GuarantorProvider } from "@/components/providers/GuarantorProvider";
import { MoveInProvider } from "@/components/providers/MoveInProvider";
import { AppShell } from "@/components/navigation/AppShell";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "brightplace",
  description: "Find your perfect place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${workSans.variable} antialiased`}>
        <UserProfileProvider>
          <RoommateProvider>
            <ToursProvider>
              <GuarantorProvider>
                <MoveInProvider>
                  <AppShell>{children}</AppShell>
                </MoveInProvider>
              </GuarantorProvider>
            </ToursProvider>
          </RoommateProvider>
        </UserProfileProvider>
      </body>
    </html>
  );
}

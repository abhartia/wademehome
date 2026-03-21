"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  UserCircle,
  Sparkles,
  Users2,
  CalendarCheck,
  Package,
  Shield,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useUserProfile } from "@/components/providers/UserProfileProvider";
import { Badge } from "@/components/ui/badge";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { JourneyStage } from "@/lib/types/userProfile";

const STAGE_EMPHASIS: Partial<Record<JourneyStage, string>> = {
  searching: "/search",
  touring: "/tours",
  applying: "/profile",
  "lease-signed": "/move-in",
  moving: "/move-in",
  "moved-in": "/profile",
};

export function AppSidebar() {
  const pathname = usePathname();
  const { profile, journeyStage } = useUserProfile();

  const showMoveIn =
    journeyStage === "lease-signed" ||
    journeyStage === "moving" ||
    journeyStage === "moved-in";

  const emphasizedHref = journeyStage
    ? STAGE_EMPHASIS[journeyStage]
    : undefined;

  const coreItems = [
    { title: "Home", href: "/app", icon: Home },
    { title: "Search", href: "/search", icon: Search },
    { title: "Tours", href: "/tours", icon: CalendarCheck },
  ];

  const moveInItem = showMoveIn
    ? [{ title: "Move-in", href: "/move-in", icon: Package }]
    : [];

  const bottomItems = [
    { title: "Roommates", href: "/roommates", icon: Users2 },
    { title: "Profile", href: "/profile", icon: UserCircle },
  ];

  const navItems = [...coreItems, ...moveInItem, ...bottomItems];

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="p-4">
        <Link href="/app" className="flex items-center gap-2">
          <BrandLogo className="h-7 w-7 text-primary" />
          <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
            Wade Me Home
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isEmphasized =
                  emphasizedHref === item.href && pathname !== item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        item.href === "/app"
                          ? pathname === "/app"
                          : pathname.startsWith(item.href)
                      }
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span
                          className={
                            isEmphasized ? "font-semibold" : undefined
                          }
                        >
                          {item.title}
                        </span>
                        {isEmphasized && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary group-data-[collapsible=icon]:hidden" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/privacy"}
              tooltip="Privacy"
            >
              <Link href="/privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Privacy</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/onboarding"}
              tooltip="Get Started"
            >
              <Link href="/onboarding" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span>Get Started</span>
                {!profile.onboardingCompleted && (
                  <Badge
                    variant="secondary"
                    className="ml-auto text-[10px] px-1.5 py-0 group-data-[collapsible=icon]:hidden"
                  >
                    New
                  </Badge>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BrandLogo } from "@/components/branding/BrandLogo";

const ITEMS = [
  { title: "Competitive analysis", href: "/property-manager/analysis", icon: BarChart3 },
];

export function PropertyManagerSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="p-4">
        <Link href="/property-manager/analysis" className="flex items-center gap-2">
          <BrandLogo className="h-7 w-7 text-primary" />
          <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
            Wade Me Home
          </span>
        </Link>
        <p className="mt-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          Property manager
        </p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Renter home">
                  <Link href="/app">
                    <Home className="h-4 w-4" />
                    <span>Renter home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

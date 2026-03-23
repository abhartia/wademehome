"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, ClipboardList, CalendarDays, FileSignature, Home } from "lucide-react";
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
  { title: "Dashboard", href: "/landlord", icon: Home },
  { title: "Properties", href: "/landlord/properties", icon: Building2 },
  { title: "Leads", href: "/landlord/leads", icon: ClipboardList },
  { title: "Tours", href: "/landlord/tours", icon: CalendarDays },
  { title: "Applications", href: "/landlord/applications", icon: ClipboardList },
  { title: "Leases", href: "/landlord/leases", icon: FileSignature },
];

export function LandlordSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="p-4">
        <Link href="/landlord" className="flex items-center gap-2">
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
              {ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/landlord"
                        ? pathname === item.href
                        : pathname.startsWith(item.href)
                    }
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

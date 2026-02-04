"use client";

import * as React from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail, SidebarGroup } from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import userAvatar from "../../assets/user.jpg";
import { LogoSection } from "./logo";
import { UnifiedNav } from "./unified-nav";
import { sidebarData } from "./sidebar-data";

const data = {
  user: {
    name: "Admin Mahek",
    email: "admin@mahek.com",
    avatar: userAvatar,
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent className="gap-0">
        <LogoSection />
        <SidebarGroup className="px-3 pt-2">
          <UnifiedNav items={sidebarData} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

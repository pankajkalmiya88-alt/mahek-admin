import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarMenuSub, 
  SidebarMenuSubButton, 
  SidebarMenuSubItem 
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router";
import type { SidebarNavItem } from "./sidebar-data";
import { cn } from "@/lib/utils";

interface UnifiedNavProps {
  items: SidebarNavItem[];
}

export function UnifiedNav({ items }: UnifiedNavProps) {
  const { pathname } = useLocation();

  return (
    <SidebarMenu className="space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.url || pathname.startsWith(item.url + "/");
        const hasSubItems = item.items && item.items.length > 0;
        const isParentActive = hasSubItems && item.items?.some(
          (sub) => pathname.includes(sub.url)
        );

        if (hasSubItems) {
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isParentActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    tooltip={item.title}
                    isActive={isParentActive}
                    className={cn(
                      "w-full justify-between rounded-md",
                      isParentActive 
                        ? "bg-[#8B1A1A] text-white hover:bg-[#8B1A1A] hover:text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                    <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub className="mt-1 space-y-0.5">
                    {item.items?.map((subItem) => {
                      const isSubActive = pathname.includes(subItem.url);

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton 
                            asChild 
                            isActive={isSubActive}
                            className={cn(
                              "w-full rounded-md pl-6",
                              isSubActive 
                                ? "bg-[#EFF6FF] text-[#1E40AF] font-semibold hover:bg-[#EFF6FF] hover:text-[#1E40AF]" 
                                : "text-gray-700 hover:bg-gray-50"
                            )}
                          >
                            <Link to={subItem.url} className="flex items-center gap-2">
                              {subItem.icon && <subItem.icon className="h-4 w-4 shrink-0" />}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        }

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton 
              asChild 
              tooltip={item.title}
              isActive={isActive}
              className={cn(
                "w-full rounded-md",
                isActive 
                  ? "bg-[#8B1A1A] text-white hover:bg-[#8B1A1A] hover:text-white" 
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Link to={item.url}>
                {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}


import { LayoutDashboard, GraduationCap, BookOpen, FileText, BookOpenCheck, Users, MessageSquare, Network, User, Settings, CreditCard, type LucideIcon } from "lucide-react";


export interface SidebarNavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}

export const sidebarData: SidebarNavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Products",
    url: "/products",
    icon: LayoutDashboard,
    isActive: true,
  },
  // {
  //   title: "Classroom",
  //   url: "#",
  //   icon: GraduationCap,
  //   items: [
  //     {
  //       title: "Syllabus",
  //       url: "/classroom/syllabus",
  //       icon: BookOpen,
  //     },
  //     {
  //       title: "Past Papers",
  //       url: "/classroom/past-papers",
  //       icon: FileText,
  //     },
  //   ],
  // },
  // {
  //   title: "Hadithi Hadithi",
  //   url: "/hadithi-hadithi",
  //   icon: BookOpenCheck,
  // },
  // {
  //   title: "Engage",
  //   url: "#",
  //   icon: Users,
  //   items: [
  //     {
  //       title: "Discussion",
  //       url: "/engage/discussion",
  //       icon: Users,
  //     },
  //     {
  //       title: "Chat",
  //       url: "/engage/chat",
  //       icon: MessageSquare,
  //     },
  //     {
  //       title: "Connection",
  //       url: "/engage/connection",
  //       icon: Network,
  //     },
  //   ],
  // },
  // {
  //   title: "Parent's Corner",
  //   url: "/parents-corner",
  //   icon: User,
  // },
  // {
  //   title: "Profile & Settings",
  //   url: "/profile-settings",
  //   icon: Settings,
  // },
  // {
  //   title: "Payment & Subscription",
  //   url: "/payment-subscription",
  //   icon: CreditCard,
  // },
];






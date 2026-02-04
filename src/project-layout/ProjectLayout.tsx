import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./pages/app-sidebar"
import { Outlet } from "react-router"
import { Bell, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import userAvatar from "../assets/user.jpg"

export default function Page() {

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 bg-white flex h-16 shrink-0 items-center justify-between gap-4 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList className="text-sm font-medium text-gray-900 gap-1.5">
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" className="text-gray-700 hover:text-gray-900 transition-colors">
                    Mahek Admin
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-500">
                  <span className="mx-1">/</span>
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-900 font-medium">
                    Dashboard
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Search Bar */}
          {/* <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 bg-gray-100 border-0 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-100"
              />
            </div>
          </div> */}

          {/* Right Side Icons and Profile */}
          <div className="flex items-center gap-3">
            {/* Notification Icon */}
            <Button variant="ghost" size="icon" className="relative h-9 w-9 hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-700" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
            </Button>

            {/* Settings Icon */}
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-gray-100">
              <Settings className="h-5 w-5 text-gray-700" />
            </Button>
           

            {/* User Profile Avatar */}
            <Avatar className="h-9 w-9 border-2 border-blue-200">
              <AvatarImage src={userAvatar} alt="User" />
              <AvatarFallback className="bg-blue-100 text-blue-700 border-2 border-blue-200">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
         <div id="outlet-area" className="relative flex-1 overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
            <Outlet />
          </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

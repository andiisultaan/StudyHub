"use client";

import * as React from "react";
import Image from "next/image";
import { Brain, Home, MessageCircleQuestion, LogOut, LogIn, BookmarkCheck } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, SidebarSeparator, SidebarFooter } from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Brain, label: "AI-Roadmap", href: "/create-roadmap" },
  { icon: MessageCircleQuestion, label: "Community Support", href: "/forum" },
];

export default function CollapsibleSidebar() {
  const { data: session } = useSession();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarContent className="flex flex-col h-full">
        <SidebarGroupLabel className="mt-2">
          <Image src="/study-hub.png" alt="StudyHub Logo" width={16} height={16} className="ml-2 mt-2 mr-2 mb-2" />
          StudyHub
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map(item => (
              <SidebarMenuItem key={item.label} className="ml-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton asChild>
                      <Link href={item.href} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            ))}
            {session && (
              <SidebarMenuItem className="ml-2">
                <Tooltip>
                  <TooltipTrigger>
                    <SidebarMenuButton asChild>
                      <Link href="/roadmaps" passHref className="flex items-center gap-2">
                        <BookmarkCheck className="h-4 w-4" />
                        <span>My Roadmaps</span>
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right">My Roadmaps</TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarSeparator className="my-2" />

        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem className="ml-2">
              {!session && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/sign-in" passHref legacyBehavior>
                      <SidebarMenuButton className="w-full justify-start">
                        <LogIn className="h-4 w-4" />
                        <span className="ml-2 group-data-[collapsible=icon]:hidden">Sign In</span>
                      </SidebarMenuButton>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Sign In</TooltipContent>
                </Tooltip>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>

        <SidebarFooter className="mt-auto">
          {session && (
            <SidebarGroupContent>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="w-full px-2 py-2">
                    <div className="flex items-center gap-2">
                      <Image src={session.user?.image ?? "/placeholder-avatar.png"} alt={session.user?.name ?? "User  avatar"} width={32} height={32} className="rounded-full object-cover shrink-0" />
                      <div className="flex flex-col items-start overflow-hidden group-data-[collapsible=icon]:hidden">
                        <span className="text-sm font-medium truncate w-full">{session.user?.name}</span>
                        <span className="text-xs text-muted-foreground truncate w-full">{session.user?.email}</span>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="absolute left-full top-0 mt-2">
                  <DropdownMenuItem onClick={() => signOut()} className="flex items-center p-2 hover:bg-gray-200 rounded">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarGroupContent>
          )}
          <SidebarTrigger className="mx-auto mt-2" />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}

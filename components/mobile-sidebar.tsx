"use client";

import * as React from "react";
import Image from "next/image";
import { Brain, Home, MessageCircleQuestion, LogOut, LogIn, BookmarkCheck } from "lucide-react"; // Make sure to import BookmarkCheck
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Brain, label: "AI-Roadmap", href: "/create-roadmap" },
  { icon: MessageCircleQuestion, label: "Community Support", href: "/forum" },
];

export function MobileSidebar() {
  const { data: session } = useSession();
  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Home className="h-6 w-6" />
          <span className="sr-only">Toggle mobile sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Image src="/study-hub.png" alt="StudyHub Logo" width={24} height={24} />
            StudyHub
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-4">
          {menuItems.map(item => (
            <Link key={item.label} href={item.href} className="flex items-center gap-2 text-lg font-medium" onClick={() => setOpenMobile(false)}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* "My Roadmaps" Section */}
        {session && (
          <Link href="/roadmaps" className="flex items-center gap-2 text-lg font-medium my-4" onClick={() => setOpenMobile(false)}>
            <BookmarkCheck className="h-5 w-5" />
            <span>My Roadmaps</span>
          </Link>
        )}

        <Separator className="my-4" />

        {!session && (
          <Link href="/sign-in" className="flex items-center gap-2 text-lg font-medium" onClick={() => setOpenMobile(false)}>
            <LogIn className="h-5 w-5" />
            Sign In
          </Link>
        )}

        {session && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={session.user?.image} alt={session.user?.name ?? "User  avatar"} />
                <AvatarFallback>{session.user?.name?.[0] ?? "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{session.user?.name}</span>
                <span className="text-sm text-muted-foreground">{session.user?.email}</span>
              </div>
            </div>
            <Button variant="outline" onClick={() => signOut()} className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

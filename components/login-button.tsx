"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <Button onClick={() => signOut()} variant="ghost" className="justify-start">
        Logout
      </Button>
    );
  }
}

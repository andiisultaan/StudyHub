"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function TermsModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-blue-600 hover:underline p-0 h-auto">
          Terms of Service
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>Please read our Terms of Service carefully.</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">1. Acceptance of Terms</h3>
          <p className="mt-2">By accessing and using StudyHub, you agree to be bound by these Terms of Service.</p>

          <h3 className="text-lg font-semibold mt-4">2. User Responsibilities</h3>
          <p className="mt-2">You are responsible for maintaining the confidentiality of your account and password.</p>

          <h3 className="text-lg font-semibold mt-4">3. Content</h3>
          <p className="mt-2">Users retain all ownership rights to the content they post on StudyHub.</p>

          {/* Add more sections as needed */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PrivacyModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-blue-600 hover:underline p-0 h-auto">
          Privacy Policy
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>Learn how we collect, use, and protect your personal information.</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">1. Information We Collect</h3>
          <p className="mt-2">We collect information you provide directly to us when you create an account.</p>

          <h3 className="text-lg font-semibold mt-4">2. How We Use Your Information</h3>
          <p className="mt-2">We use the information we collect to provide, maintain, and improve our services.</p>

          <h3 className="text-lg font-semibold mt-4">3. Information Sharing and Disclosure</h3>
          <p className="mt-2">We do not share your personal information with third parties except as described in this policy.</p>

          {/* Add more sections as needed */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function LoginPage() {
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <SidebarInset className="flex items-center justify-center min-h-screen bg-transparent">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome to StudyHub</CardTitle>
          <CardDescription className="text-center">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGoogleLogin} className="w-full flex items-center justify-center space-x-2" variant="outline">
            <Image src="/google.svg" alt="Google logo" width={20} height={20} />
            <span>Sign in with Google</span>
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm text-gray-600">
          <p>By signing in, you agree to our</p>
          <div className="flex space-x-1">
            <TermsModal />
            <span>and</span>
            <PrivacyModal />
          </div>
        </CardFooter>
      </Card>
    </SidebarInset>
  );
}

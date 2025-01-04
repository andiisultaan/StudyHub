"use client";

import * as React from "react";
import { MessageSquare, Book, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface AskQuestionModalProps {
  onQuestionAdded: () => void;
}

export default function AskQuestionModal({ onQuestionAdded }: AskQuestionModalProps) {
  const { data: session } = useSession();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit question");
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: "Your question has been posted successfully.",
      });
      setOpen(false);
      setTitle("");
      setContent("");
      onQuestionAdded(); // Call the prop function to update the questions list
    } catch (error) {
      console.error("Error submitting question:", error);
      toast({
        title: "Error",
        description: "Failed to post your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="px-6">
          <MessageSquare className="h-5 w-5 mr-2" />
          Ask a Question
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        {session ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Ask a Question</DialogTitle>
              <DialogDescription className="text-base">Post your question to the StudyHub Forum. Be specific and provide context to get better answers.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title
                  </Label>
                  <Input id="title" placeholder="Enter a descriptive title for your question" value={title} onChange={e => setTitle(e.target.value)} className="w-full" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-medium">
                    Question Details
                  </Label>
                  <Textarea id="content" placeholder="Provide more context and details about your question" value={content} onChange={e => setContent(e.target.value)} className="w-full min-h-[150px]" required />
                </div>
              </div>
              <DialogFooter className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Book className="h-4 w-4 mr-2" />
                  <span>Your question will be public</span>
                </div>
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post Question"}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <LogIn className="h-12 w-12 text-muted-foreground" />
            <DialogTitle className="text-xl">Login Required</DialogTitle>
            <DialogDescription className="text-center">You need to be logged in to ask a question. Please log in to continue.</DialogDescription>
            <Link href="/sign-in">
              <Button size="lg">Sign In</Button>
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

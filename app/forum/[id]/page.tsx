"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Send, ArrowLeft, User, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";

interface Answer {
  _id: string;
  content: string;
  createdAt: string;
  name: string;
  comments: Comment[];
}

interface Question {
  data: {
    _id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    views: number;
  };
}

export default function QuestionDetailPage({ params }: { params: { id: string } }) {
  const [question, setQuestion] = React.useState<Question | null>(null);
  const [answers, setAnswers] = React.useState<Answer[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [newAnswer, setNewAnswer] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { data: session } = useSession();

  const fetchQuestion = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/questions/${params.id}`, {
        cache: "no-cache",
        method: "GET",
      });

      if (!response.ok) throw new Error("Failed to fetch question");

      const questionData = await response.json();
      setQuestion(questionData);
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  }, [params.id]);

  const fetchAnswers = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/answers?questionId=${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch answers");

      const data = await response.json();
      setAnswers(data.answers);
    } catch (error) {
      console.error("Error fetching answers:", error);
    }
  }, [params.id]);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchQuestion(), fetchAnswers()]);
      setIsLoading(false);
    };

    fetchData();
  }, [fetchQuestion, fetchAnswers]);

  const handleAddAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim() || !question || !session?.user) {
      console.error("Missing required data for answer submission");
      return;
    }

    setIsSubmitting(true);

    try {
      const answerData = {
        content: newAnswer,
        questionId: question.data._id,
        userId: session.user.id,
        name: session.user.name || "Anonymous",
      };

      const response = await fetch(`/api/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add answer: ${JSON.stringify(errorData)}`);
      }

      // Clear the input
      setNewAnswer("");

      // Refetch answers to get the latest data
      await fetchAnswers();
    } catch (error) {
      console.error("Error adding answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-transparent">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
          <h2 className="text-2xl font-bold mb-2">Question not found</h2>
          <p className="text-muted-foreground">The question you're looking for doesn't exist or has been removed.</p>
          <Link href="/forum" className="mt-4 inline-block">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Forum
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link href="/forum" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forum
        </Link>

        <h1 className="text-3xl font-bold mb-4">{question.data.title}</h1>
        <Card className="p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-grow">
              <p className="text-lg mb-4">{question.data.content}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{question.data.author || "Anonymous"}</span>
                </div>
                <span>Asked {question.data.createdAt ? format(new Date(question.data.createdAt), "PPp") : "Unknown date"}</span>
              </div>
            </div>
          </div>
        </Card>

        <h2 className="text-2xl font-semibold mb-4">{answers.length} Answers</h2>
        {answers.map(answer => (
          <Card key={answer._id} id={answer._id} className="p-6 mb-4">
            <div className="flex items-start space-x-4">
              <div className="flex-grow">
                <p className="text-lg mb-4">{answer.content}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="font-semibold">Answered by</span>
                    <span>{answer.name}</span>
                  </div>
                  <span>Answered {answer.createdAt ? format(new Date(answer.createdAt), "PPp") : "Just now"}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {session?.user ? (
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Your Answer</h3>
            <form onSubmit={handleAddAnswer}>
              <Textarea value={newAnswer} onChange={e => setNewAnswer(e.target.value)} placeholder="Write your answer here..." className="mb-4" rows={6} />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Post Your Answer
                  </>
                )}
              </Button>
            </form>
          </Card>
        ) : (
          <div className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-4">You must be logged in to answer</h3>
            <Link href="/sign-in">
              <Button variant="outline">Login to Add Your Answer</Button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

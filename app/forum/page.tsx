"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, User } from "lucide-react";
import Image from "next/image";
import debounce from "lodash.debounce";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AskQuestionModal from "@/components/ask-question-modal";
import Link from "next/link";

interface Question {
  _id: string;
  title: string;
  content: string;
  author: string;
  userId: string;
  createdAt: string;
}

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const debouncedSearch = React.useMemo(
    () =>
      debounce((query: string) => {
        setDebouncedSearchQuery(query);
      }, 300),
    []
  );

  const fetchQuestions = async (isPolling = false, search = "") => {
    if (!isPolling) setIsLoading(true);
    try {
      const response = await fetch(`/api/questions?limit=${limit}&skip=${(page - 1) * limit}${search ? `&search=${encodeURIComponent(search)}` : ""}`);
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      setQuestions(prevQuestions => {
        if (search || page === 1) {
          return data;
        }
        const newQuestions = data.filter((newQuestion: Question) => !prevQuestions.some(prevQuestion => prevQuestion._id === newQuestion._id));
        return [...prevQuestions, ...newQuestions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      });
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      if (!isPolling) setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchQuestions(false, debouncedSearchQuery);

    const pollInterval = setInterval(() => {
      fetchQuestions(true, debouncedSearchQuery);
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollInterval);
  }, [page, debouncedSearchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setDebouncedSearchQuery(searchQuery);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div className="container mx-auto px-4 py-8" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Image src="/study-hub.png" alt="StudyHub Logo" width={100} height={100} className="w-24 h-24 sm:w-20 sm:h-20" />
        <motion.h1 className="text-3xl font-bold" variants={itemVariants}>
          StudyHub Forum
        </motion.h1>
      </motion.div>

      <motion.div className="mb-8" variants={itemVariants}>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input type="text" placeholder="Search questions..." value={searchQuery} onChange={handleSearchChange} className="flex-grow" />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </motion.div>

      <motion.div className="flex justify-between items-center mb-6" variants={itemVariants}>
        <h2 className="text-2xl font-semibold">{debouncedSearchQuery ? `Search Results for "${debouncedSearchQuery}"` : "Recent Questions"}</h2>
        <AskQuestionModal onQuestionAdded={() => fetchQuestions(false, debouncedSearchQuery)} />
      </motion.div>

      <motion.div className="space-y-4" variants={containerVariants}>
        {questions.map(question => (
          <motion.div key={question._id} variants={itemVariants}>
            <Link href={`/forum/${question._id}`}>
              <QuestionCard question={question} />
            </Link>
          </motion.div>
        ))}
        {isLoading &&
          Array(3)
            .fill(null)
            .map((_, index) => (
              <motion.div key={`skeleton-${index}`} variants={itemVariants}>
                <QuestionCardSkeleton />
              </motion.div>
            ))}
      </motion.div>

      {!isLoading && questions.length >= limit * page && (
        <motion.div className="mt-8 text-center" variants={itemVariants}>
          <Button onClick={handleLoadMore}>Load More</Button>
        </motion.div>
      )}

      {!isLoading && questions.length === 0 && (
        <motion.div className="mt-8 text-center text-muted-foreground" variants={itemVariants}>
          No questions found. Be the first to ask a question!
        </motion.div>
      )}
    </motion.div>
  );
}

function QuestionCard({ question }: { question: Question }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{question.title}</h3>
      </div>
      <p className="text-muted-foreground mb-4">{question.content}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>Asked by {question.author}</span>
        </div>
        <div className="text-sm text-muted-foreground">{new Date(question.createdAt).toLocaleString()}</div>
      </div>
    </Card>
  );
}

function QuestionCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </Card>
  );
}

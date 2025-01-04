"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, BookOpen, PlusCircle } from "lucide-react";
import { SerializedRoadmapType } from "@/types/roadmap";
import { DeleteRoadmapButton } from "./DeleteRoadmapButton";
import { Button } from "@/components/ui/button";

interface RoadmapListProps {
  roadmaps: SerializedRoadmapType[];
}

export default function RoadmapList({ roadmaps: initialRoadmaps }: RoadmapListProps) {
  const [roadmaps, setRoadmaps] = useState(initialRoadmaps);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const handleDelete = (deletedId: string) => {
    setRoadmaps(roadmaps.filter(roadmap => roadmap._id !== deletedId));
  };

  if (roadmaps.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
          <p className="text-xl text-muted-foreground mb-6">You haven&apos;t created any roadmaps yet.</p>
          <Link href="/create-roadmap" passHref>
            <Button size="lg" className="inline-flex items-center">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Your First Roadmap
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {roadmaps.map(roadmap => (
          <motion.div key={roadmap._id} variants={item} exit={{ opacity: 0, y: -20 }}>
            <Card className="h-full flex flex-col dark:border-muted">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-semibold">{roadmap.goal}</CardTitle>
                <DeleteRoadmapButton roadmapId={roadmap._id} onDelete={() => handleDelete(roadmap._id)} />
              </CardHeader>
              <CardContent className="flex-grow">
                <Badge variant="secondary" className="mb-2">
                  {roadmap.skill_level}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground mt-4">
                  <Calendar className="mr-2 h-4 w-4" />
                  <time dateTime={roadmap.createdAt}>{formatDate(roadmap.createdAt)}</time>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>{roadmap.roadmap.length} Stages</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/roadmaps/${roadmap._id}`} className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
                  View Roadmap
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

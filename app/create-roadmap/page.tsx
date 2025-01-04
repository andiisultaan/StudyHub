"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { BookOpen, Compass, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AIGeneratedRoadmap from "@/components/ai-generated-roadmap";
import { useToast } from "@/hooks/use-toast";
import { LoadingAnimation } from "@/components/loading-animation";

interface RoadmapData {
  goal: string;
  skill_level: string;
  roadmap: Array<{
    stage: string;
    topics: Array<{
      name: string;
      description: string;
      resources: Array<{
        name: string;
        url: string;
      }>;
    }>;
  }>;
}

const loadingMessages = ["Analyzing your learning goals...", "Crafting a personalized roadmap...", "Curating relevant resources...", "Optimizing your learning journey...", "Finalizing your roadmap..."];

export default function CreateRoadmap() {
  const [topic, setTopic] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [level, setLevel] = React.useState("beginner");
  const [isLoading, setIsLoading] = React.useState(false);
  const [roadmapGenerated, setRoadmapGenerated] = React.useState(false);
  const [roadmapData, setRoadmapData] = React.useState<RoadmapData | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, description, level }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate roadmap");
      }

      const data = await response.json();
      setRoadmapData(data);
      setRoadmapGenerated(true);
    } catch (error) {
      console.error("Error generating roadmap:", error);
      toast({
        title: "Error",
        description: "Failed to generate roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
    <>
      {!roadmapGenerated ? (
        <motion.div className="mx-auto w-full max-w-3xl space-y-8 p-8" initial="hidden" animate="visible" variants={containerVariants}>
          {!isLoading ? (
            <>
              <motion.div className="space-y-2" variants={itemVariants}>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">Create Your Learning Roadmap</h1>
                <p className="text-lg text-muted-foreground">Let AI help you create a personalized learning path for any topic</p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="border-border/40 bg-card p-6 shadow-lg">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="topic">What would you like to learn?</Label>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input id="topic" placeholder="e.g., Web Development, Machine Learning, Data Science" value={topic} onChange={e => setTopic(e.target.value)} className="pl-10" />
                      </div>
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label htmlFor="description">Tell us more about your learning goals</Label>
                      <div className="relative">
                        <Compass className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Textarea
                          id="description"
                          placeholder="What specific areas are you interested in? What do you want to achieve? e.g., mastering frontend development, understanding UI/UX design, or becoming proficient in Python for data analysis"
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                          className="min-h-[100px] pl-10"
                        />
                      </div>
                    </motion.div>

                    <motion.div className="space-y-2" variants={itemVariants}>
                      <Label>Select your current level</Label>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {["beginner", "intermediate", "advanced"].map(option => (
                          <motion.div key={option} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button type="button" variant={level === option ? "default" : "outline"} className="w-full capitalize" onClick={() => setLevel(option)}>
                              <GraduationCap className="mr-2 h-4 w-4" />
                              {option}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Button type="submit" className="w-full">
                        Generate Roadmap
                      </Button>
                    </motion.div>
                  </form>
                </Card>
              </motion.div>
            </>
          ) : (
            <LoadingAnimation messages={loadingMessages} />
          )}
        </motion.div>
      ) : (
        roadmapData && <AIGeneratedRoadmap roadmapData={roadmapData} />
      )}
    </>
  );
}

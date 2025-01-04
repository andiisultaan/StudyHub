"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { BookOpen, Code, Layout, Palette, Rocket, ChevronRight, ExternalLink, Save } from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const stageIcons = [BookOpen, Code, Layout, Palette, Rocket];

interface Resource {
  name: string;
  url: string;
}

interface Topic {
  name: string;
  description: string;
  resources: Resource[];
}

interface Stage {
  stage: string;
  topics: Topic[];
}

interface RoadmapData {
  goal: string;
  skill_level: string;
  roadmap: Stage[];
}

interface AIGeneratedRoadmapProps {
  roadmapData: RoadmapData;
}

async function postRoadmapToDatabase(roadmapData: RoadmapData, userId: string | undefined) {
  const response = await fetch("/api/save-roadmap", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      ...roadmapData,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save roadmap");
  }

  return response.json();
}

export default function AIGeneratedRoadmap({ roadmapData }: AIGeneratedRoadmapProps) {
  const { data: session } = useSession();
  const [activeStage, setActiveStage] = React.useState(0);
  const [activeTopic, setActiveTopic] = React.useState(0);
  const [isSaving, setIsSaving] = React.useState(false);
  const { toast } = useToast();

  const handleSaveRoadmap = async () => {
    if (!session) {
      toast({
        title: "Error",
        description: "You must be logged in to save a roadmap.",
        variant: "destructive",
      });
      return;
    }
    setIsSaving(true);
    try {
      await postRoadmapToDatabase(roadmapData, session.user?.id);
      toast({
        title: "Roadmap Saved",
        description: "Your learning journey has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving roadmap:", error);
      toast({
        title: "Error",
        description: "Failed to save roadmap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNextStage = () => {
    if (activeStage < roadmapData.roadmap.length - 1) {
      setActiveStage(activeStage + 1);
      setActiveTopic(0);
    }
  };

  const handlePrevStage = () => {
    if (activeStage > 0) {
      setActiveStage(activeStage - 1);
      setActiveTopic(0);
    }
  };

  const handleNextTopic = () => {
    if (activeTopic < roadmapData.roadmap[activeStage].topics.length - 1) {
      setActiveTopic(activeTopic + 1);
    } else {
      handleNextStage();
    }
  };

  const handlePrevTopic = () => {
    if (activeTopic > 0) {
      setActiveTopic(activeTopic - 1);
    } else {
      handlePrevStage();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold capitalize">{roadmapData.goal}</h1>
        <p className="text-lg text-muted-foreground capitalize">Skill Level: {roadmapData.skill_level}</p>
      </motion.div>

      <div className="mb-8 flex justify-center">
        <Button onClick={handleSaveRoadmap} className="bg-primary text-primary-foreground hover:bg-primary/90" size="lg" disabled={isSaving || !session}>
          {isSaving ? (
            <>
              <motion.div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-2 border-primary-foreground" style={{ borderTopColor: "transparent" }} />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {session ? "Save Roadmap" : "Login to Save"}
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr,2fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Learning Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh]">
              {roadmapData.roadmap.map((stage, stageIndex) => (
                <div key={stage.stage} className="mb-4">
                  <Button
                    variant={activeStage === stageIndex ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveStage(stageIndex);
                      setActiveTopic(0);
                    }}
                  >
                    {React.createElement(stageIcons[stageIndex % stageIcons.length], { className: "mr-2 h-4 w-4" })}
                    {stage.stage}
                  </Button>
                  {activeStage === stageIndex && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="ml-4 mt-2 space-y-2">
                      {stage.topics.map((topic, topicIndex) => (
                        <Button key={topic.name} variant={activeTopic === topicIndex ? "secondary" : "ghost"} size="sm" className="w-full justify-start" onClick={() => setActiveTopic(topicIndex)}>
                          <ChevronRight className="mr-2 h-4 w-4" />
                          {topic.name}
                        </Button>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-bold">
              {React.createElement(stageIcons[activeStage % stageIcons.length], { className: "mr-2 h-6 w-6" })}
              {roadmapData.roadmap[activeStage].stage}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div key={`${activeStage}-${activeTopic}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h3 className="mb-2 text-xl font-semibold">{roadmapData.roadmap[activeStage].topics[activeTopic].name}</h3>
              <p className="mb-4 text-muted-foreground">{roadmapData.roadmap[activeStage].topics[activeTopic].description}</p>
              <h4 className="mb-2 font-semibold">Resources:</h4>
              <div className="space-y-2">
                {roadmapData.roadmap[activeStage].topics[activeTopic].resources.map((resource, index) => (
                  <Button key={index} variant="outline" size="sm" className="w-full justify-start" asChild>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {resource.name}
                    </a>
                  </Button>
                ))}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-between">
        <Button onClick={handlePrevTopic} disabled={activeStage === 0 && activeTopic === 0}>
          Previous Topic
        </Button>
        <Button onClick={handleNextTopic} disabled={activeStage === roadmapData.roadmap.length - 1 && activeTopic === roadmapData.roadmap[activeStage].topics.length - 1}>
          Next Topic
        </Button>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, ExternalLink, ChevronRight, ArrowLeft } from "lucide-react";
import { RoadmapType } from "@/models/Roadmap";
import Link from "next/link";

// You'll need to create this function to handle the API call
async function updateRoadmap(roadmapId: string, userId: string) {
  const response = await fetch(`/api/roadmaps/${roadmapId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
  if (!response.ok) {
    throw new Error("Failed to update roadmap");
  }
  return response.json();
}

const stageIcons = [ChevronRight, ExternalLink, Save]; // Add more icons as needed

interface RoadmapDetailProps {
  roadmap: RoadmapType;
}

export default function RoadmapDetail({ roadmap }: RoadmapDetailProps) {
  const { data: session } = useSession();
  const [activeStage, setActiveStage] = React.useState(0);
  const [activeTopic, setActiveTopic] = React.useState(0);

  const handleNextStage = () => {
    if (activeStage < roadmap.roadmap.length - 1) {
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
    if (activeTopic < roadmap.roadmap[activeStage].topics.length - 1) {
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
      <Link href="/roadmaps" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to My Roadmaps
      </Link>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold capitalize">{roadmap.goal}</h1>
        <p className="text-lg text-muted-foreground capitalize">Skill Level: {roadmap.skill_level}</p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-[1fr,2fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Learning Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh]">
              {roadmap.roadmap.map((stage, stageIndex) => (
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
              {roadmap.roadmap[activeStage].stage}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div key={`${activeStage}-${activeTopic}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <h3 className="mb-2 text-xl font-semibold">{roadmap.roadmap[activeStage].topics[activeTopic].name}</h3>
              <p className="mb-4 text-muted-foreground">{roadmap.roadmap[activeStage].topics[activeTopic].description}</p>
              <h4 className="mb-2 font-semibold">Resources:</h4>
              <div className="space-y-2">
                {roadmap.roadmap[activeStage].topics[activeTopic].resources.map((resource, index) => (
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
        <Button onClick={handleNextTopic} disabled={activeStage === roadmap.roadmap.length - 1 && activeTopic === roadmap.roadmap[activeStage].topics.length - 1}>
          Next Topic
        </Button>
      </div>
    </div>
  );
}

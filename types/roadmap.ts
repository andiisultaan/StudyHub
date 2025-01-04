import { ObjectId } from "mongodb";

export interface Resource {
  name: string;
  url: string;
}

export interface Topic {
  name: string;
  description: string;
  resources: Resource[];
}

export interface Stage {
  stage: string;
  topics: Topic[];
}

export interface RoadmapType {
  _id: ObjectId;
  userId: string;
  goal: string;
  skill_level: string;
  roadmap: Stage[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface SerializedRoadmapType {
  _id: string;
  userId: string;
  goal: string;
  skill_level: string;
  roadmap: Stage[];
  createdAt: string;
  updatedAt: string | null;
}

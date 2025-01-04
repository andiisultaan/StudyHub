import { ObjectId } from "mongodb";
import { database } from "@/lib/mongodb";

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

const roadmaps = database.collection<RoadmapType>("Roadmaps");

export async function createRoadmap(input: Omit<RoadmapType, "_id" | "createdAt" | "updatedAt">): Promise<{ message: string; roadmapId: ObjectId }> {
  const roadmap = {
    _id: new ObjectId(),
    ...input,
    createdAt: new Date(),
  };

  const result = await roadmaps.insertOne(roadmap);
  if (!result.insertedId) throw new Error("Failed to add roadmap");
  return { message: "Roadmap saved successfully", roadmapId: result.insertedId };
}

export async function getRoadmapById(id: string): Promise<RoadmapType | null> {
  return roadmaps.findOne({ _id: new ObjectId(id) });
}

export async function getRoadmapsByUserId(userId: string): Promise<RoadmapType[]> {
  return roadmaps.find({ userId }).sort({ createdAt: -1 }).toArray();
}

export async function updateRoadmap(id: string, update: Partial<Omit<RoadmapType, "_id" | "userId" | "createdAt">>): Promise<{ message: string }> {
  const result = await roadmaps.updateOne({ _id: new ObjectId(id) }, { $set: { ...update, updatedAt: new Date() } });
  if (result.matchedCount === 0) throw new Error("Roadmap not found");
  return { message: "Roadmap updated successfully" };
}

export async function deleteRoadmap(id: string): Promise<{ message: string }> {
  const result = await roadmaps.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) throw new Error("Roadmap not found");
  return { message: "Roadmap deleted successfully" };
}

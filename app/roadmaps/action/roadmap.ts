"use server";

import { deleteRoadmap as deleteRoadmapFromDB } from "@/models/Roadmap";
import { revalidatePath } from "next/cache";

export async function deleteRoadmap(id: string) {
  try {
    await deleteRoadmapFromDB(id);
    revalidatePath("/roadmaps");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete roadmap:", error);
    return { success: false, error: "Failed to delete roadmap" };
  }
}

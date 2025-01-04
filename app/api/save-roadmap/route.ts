import { NextResponse } from "next/server";
import { createRoadmap, RoadmapType } from "@/models/Roadmap";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received body:", body);

    // Validate the input
    if (!body.userId || !body.goal || !body.skill_level || !body.roadmap) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Prepare the input for createRoadmap function
    const roadmapInput: Omit<RoadmapType, "_id" | "createdAt" | "updatedAt"> = {
      userId: body.userId,
      goal: body.goal,
      skill_level: body.skill_level,
      roadmap: body.roadmap,
    };

    const result = await createRoadmap(roadmapInput);
    console.log("Saved roadmap:", result);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/save-roadmap:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

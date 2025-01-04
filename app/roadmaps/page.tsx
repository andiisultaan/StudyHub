import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";
import { getRoadmapsByUserId } from "@/models/Roadmap";
import RoadmapList from "./RoadmapList";
import { redirect } from "next/navigation";
import { SerializedRoadmapType } from "@/types/roadmap";

export default async function RoadmapsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const roadmaps = await getRoadmapsByUserId(session.user.id);

  // Ensure dates are properly serialized
  const serializedRoadmaps: SerializedRoadmapType[] = roadmaps.map(roadmap => ({
    ...roadmap,
    _id: roadmap._id.toString(),
    createdAt: new Date(roadmap.createdAt).toISOString(),
    updatedAt: roadmap.updatedAt ? new Date(roadmap.updatedAt).toISOString() : null,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Roadmaps</h1>
      <RoadmapList roadmaps={serializedRoadmaps} />
    </div>
  );
}

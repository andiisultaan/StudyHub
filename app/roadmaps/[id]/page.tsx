import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";
import { getRoadmapById } from "@/models/Roadmap";
import { notFound, redirect } from "next/navigation";
import RoadmapDetail from "./RoadmapDetail";

export default async function RoadmapPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const roadmap = await getRoadmapById(params.id);

  if (!roadmap) {
    notFound();
  }

  // Check if the roadmap belongs to the current user
  if (roadmap.userId !== session.user.id) {
    // If not, redirect to the roadmaps list or show an error
    redirect("/roadmaps");
  }

  return <RoadmapDetail roadmap={roadmap} />;
}

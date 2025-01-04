import { NextRequest, NextResponse } from "next/server";
import { Questions } from "@/models/Question";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/authOptions";
import { z } from "zod";

// Schema for creating a new question
const CreateQuestionSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
});

// Schema for updating an existing question
const UpdateQuestionSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
});

// Helper function to handle errors
function handleError(error: unknown) {
  console.error("API Error:", error);
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: error.errors }, { status: 400 });
  }
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validatedData = CreateQuestionSchema.parse(body);

    const result = await Questions.createQuestion({
      userId: session.user.id,
      author: session.user.name || "Anonymous",
      ...validatedData,
      createdAt: new Date(),
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
  const skip = Math.max(parseInt(searchParams.get("skip") || "0"), 0);
  const search = searchParams.get("search") || "";

  try {
    const questions = await Questions.getQuestions(limit, skip, search);
    return NextResponse.json(questions);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Question ID is required" }, { status: 400 });
    }

    const validatedData = UpdateQuestionSchema.parse(updateData);

    const updatedQuestion = await Questions.updateQuestion(id, session.user.id, validatedData);

    if (!updatedQuestion) {
      return NextResponse.json({ error: "Question not found or you're not authorized to update it" }, { status: 404 });
    }

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Question ID is required" }, { status: 400 });
    }

    const deletedQuestion = await Questions.deleteQuestion(id, session.user.id);

    if (!deletedQuestion) {
      return NextResponse.json({ error: "Question not found or you're not authorized to delete it" }, { status: 404 });
    }

    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (error) {
    return handleError(error);
  }
}

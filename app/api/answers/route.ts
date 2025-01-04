import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { createAnswer, AnswerType, getAnswersByQuestionId } from "@/models/Answer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received body:", body);

    // Validate the input
    if (!body.questionId || !body.userId || !body.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Prepare the input for createAnswer function
    const answerInput: Omit<AnswerType, "_id"> = {
      questionId: new ObjectId(body.questionId),
      userId: body.userId,
      content: body.content,
      name: body.name || "Anonymous",
      createdAt: new Date(),
    };

    const result = await createAnswer(answerInput);
    console.log("Created answer:", result);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/answers:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get("questionId");

    if (!questionId) {
      return NextResponse.json({ error: "Missing questionId parameter" }, { status: 400 });
    }

    const answers = await getAnswersByQuestionId(questionId);
    console.log(`Fetched ${answers.length} answers for question ${questionId}`);

    return NextResponse.json({ answers }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/answers:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { Questions } from "@/models/Question";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        {
          message: "id is not provided",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const question = await Questions.getQuestionById(id);

    // Increment the view count
    await Questions.incrementViews(id);

    return NextResponse.json(
      {
        message: "Success",
        data: question,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Question not found") {
      return NextResponse.json(
        {
          message: "Question not found",
          data: null,
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json({ message: "Internal Server Error", data: null }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await request.json();
    const { userId, ...update } = body;

    if (!id || !userId) {
      return NextResponse.json(
        {
          message: "id and userId are required",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const result = await Questions.updateQuestion(id, userId, update);

    return NextResponse.json(
      {
        message: result.message,
        data: null,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Question not found or user not authorized") {
      return NextResponse.json(
        {
          message: "Question not found or user not authorized",
          data: null,
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json({ message: "Internal Server Error", data: null }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const { userId } = await request.json();

    if (!id || !userId) {
      return NextResponse.json(
        {
          message: "id and userId are required",
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const result = await Questions.deleteQuestion(id, userId);

    return NextResponse.json(
      {
        message: result.message,
        data: null,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Question not found or user not authorized") {
      return NextResponse.json(
        {
          message: "Question not found or user not authorized",
          data: null,
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json({ message: "Internal Server Error", data: null }, { status: 500 });
  }
}

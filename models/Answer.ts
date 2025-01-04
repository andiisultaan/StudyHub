import { ObjectId } from "mongodb";
import { database } from "@/lib/mongodb";

export interface AnswerType {
  _id: ObjectId;
  questionId: ObjectId;
  userId: string;
  name: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

const answers = database.collection<AnswerType>("Answers");

export async function createAnswer(input: Omit<AnswerType, "_id" | "createdAt" | "updatedAt">): Promise<{ message: string; answerId: ObjectId }> {
  const answer = {
    _id: new ObjectId(),
    ...input,
    questionId: new ObjectId(input.questionId),
    votes: 0,
    createdAt: new Date(),
  };

  const result = await answers.insertOne(answer);
  if (!result.insertedId) throw new Error("Failed to add answer");
  return { message: "Answer added successfully", answerId: result.insertedId };
}

export async function getAnswerById(id: string): Promise<AnswerType | null> {
  return answers.findOne({ _id: new ObjectId(id) });
}

export async function getAnswersByQuestionId(questionId: string): Promise<AnswerType[]> {
  return answers
    .find({ questionId: new ObjectId(questionId) })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function updateAnswer(id: string, update: Partial<Omit<AnswerType, "_id" | "questionId" | "userId" | "createdAt">>): Promise<{ message: string }> {
  const result = await answers.updateOne({ _id: new ObjectId(id) }, { $set: { ...update, updatedAt: new Date() } });
  if (result.matchedCount === 0) throw new Error("Answer not found");
  return { message: "Answer updated successfully" };
}

export async function deleteAnswer(id: string): Promise<{ message: string }> {
  const result = await answers.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) throw new Error("Answer not found");
  return { message: "Answer deleted successfully" };
}

export async function voteAnswer(id: string, voteType: "upvote" | "downvote"): Promise<{ message: string }> {
  const voteIncrement = voteType === "upvote" ? 1 : -1;
  const result = await answers.updateOne({ _id: new ObjectId(id) }, { $inc: { votes: voteIncrement } });
  if (result.matchedCount === 0) throw new Error("Answer not found");
  return { message: `Answer ${voteType}d successfully` };
}

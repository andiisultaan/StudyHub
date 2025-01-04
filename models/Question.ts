import { z } from "zod";
import { ObjectId } from "mongodb";
import { database } from "../lib/mongodb";

// Schema for validating ObjectId
const ObjectIdSchema = z
  .string()
  .refine(val => ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  })
  .or(z.instanceof(ObjectId));

// Schema for Question document
const QuestionSchema = z.object({
  _id: ObjectIdSchema.optional(),
  userId: z.string(),
  author: z.string(),
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

type QuestionType = z.infer<typeof QuestionSchema>;

export class Questions {
  private static collection = database.collection<QuestionType>("Questions");

  static async createQuestion(input: Omit<QuestionType, "_id">): Promise<{ message: string; questionId: ObjectId }> {
    const validatedInput = QuestionSchema.parse(input);
    const question = {
      ...validatedInput,
      userId: validatedInput.userId,
      createdAt: new Date(),
    };

    const result = await this.collection.insertOne(question);
    if (!result.insertedId) throw new Error("Failed to add question");
    return { message: "Question added successfully", questionId: new ObjectId(result.insertedId) };
  }

  static async getQuestionById(id: string): Promise<QuestionType> {
    const objectId = new ObjectId(id);
    const question = await this.collection.findOne({ _id: objectId });
    if (!question) throw new Error("Question not found");
    return question;
  }

  static async getQuestions(limit: number = 10, skip: number = 0, search: string = ""): Promise<QuestionType[]> {
    const query = search ? { $or: [{ title: { $regex: search, $options: "i" } }, { content: { $regex: search, $options: "i" } }] } : {};

    const questions = await this.collection.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray();

    return questions;
  }

  static async updateQuestion(id: string, userId: string, update: Partial<QuestionType>): Promise<{ message: string }> {
    const objectId = new ObjectId(id);

    const validatedUpdate = QuestionSchema.partial().parse(update);

    const result = await this.collection.updateOne(
      { _id: objectId, userId: userId },
      {
        $set: {
          ...validatedUpdate,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) throw new Error("Question not found or user not authorized");
    return { message: "Question updated successfully" };
  }

  static async deleteQuestion(id: string, userId: string): Promise<{ message: string }> {
    const objectId = new ObjectId(id);

    const result = await this.collection.deleteOne({ _id: objectId, userId: userId });
    if (result.deletedCount === 0) throw new Error("Question not found or user not authorized");
    return { message: "Question deleted successfully" };
  }

  static async incrementViews(id: string): Promise<void> {
    const objectId = new ObjectId(id);
    await this.collection.updateOne({ _id: objectId }, { $inc: { views: 1 } });
  }

  static async addAnswer(questionId: string, answer: { content: string; userId: string; author: string }): Promise<{ message: string; answerId: ObjectId }> {
    const objectId = new ObjectId(questionId);
    const answerId = new ObjectId();

    const result = await this.collection.updateOne(
      { _id: objectId },
      {
        $push: {
          answers: {
            _id: answerId,
            content: answer.content,
            userId: answer.userId,
            author: answer.author,
            createdAt: new Date(),
            votes: 0,
          },
        },
      }
    );

    if (result.matchedCount === 0) throw new Error("Question not found");
    return { message: "Answer added successfully", answerId };
  }
}

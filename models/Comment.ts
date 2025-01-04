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

// Schema for Comment document
const CommentSchema = z.object({
  _id: ObjectIdSchema.optional(),
  parentId: ObjectIdSchema, // This can be either a questionId or an answerId
  parentType: z.enum(["question", "answer"]),
  userId: z.string().or(ObjectIdSchema),
  author: z.string(),
  content: z.string().min(1).max(1000),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
});

type CommentType = z.infer<typeof CommentSchema>;

export class Comments {
  private static collection = database.collection<CommentType>("Comments");

  static async createComment(input: Omit<CommentType, "_id">): Promise<{ message: string; commentId: ObjectId }> {
    const validatedInput = CommentSchema.parse(input);
    const comment = {
      ...validatedInput,
      parentId: typeof validatedInput.parentId === "string" ? new ObjectId(validatedInput.parentId) : validatedInput.parentId,
      userId: typeof validatedInput.userId === "string" ? new ObjectId(validatedInput.userId) : validatedInput.userId,
      createdAt: new Date(),
    };

    const result = await this.collection.insertOne(comment);
    if (!result.insertedId) throw new Error("Failed to add comment");
    return { message: "Comment added successfully", commentId: new ObjectId(result.insertedId) };
  }

  static async getCommentById(id: string): Promise<CommentType> {
    const objectId = new ObjectId(id);
    const comment = await this.collection.findOne({ _id: objectId });
    if (!comment) throw new Error("Comment not found");
    return comment;
  }

  static async getCommentsByParentId(parentId: string, parentType: "question" | "answer"): Promise<CommentType[]> {
    const objectId = new ObjectId(parentId);
    return this.collection.find({ parentId: objectId, parentType }).sort({ createdAt: -1 }).toArray();
  }

  static async updateComment(id: string, userId: string, update: Partial<CommentType>): Promise<{ message: string }> {
    const objectId = new ObjectId(id);
    const userObjectId = new ObjectId(userId);

    const validatedUpdate = CommentSchema.partial().parse(update);

    const result = await this.collection.updateOne(
      { _id: objectId, userId: userObjectId },
      {
        $set: {
          ...validatedUpdate,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) throw new Error("Comment not found or user not authorized");
    return { message: "Comment updated successfully" };
  }

  static async deleteComment(id: string, userId: string): Promise<{ message: string }> {
    const objectId = new ObjectId(id);
    const userObjectId = new ObjectId(userId);

    const result = await this.collection.deleteOne({ _id: objectId, userId: userObjectId });
    if (result.deletedCount === 0) throw new Error("Comment not found or user not authorized");
    return { message: "Comment deleted successfully" };
  }
}

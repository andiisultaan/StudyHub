import { ObjectId } from "mongodb";

export interface Comment {
  _id?: ObjectId;
  content: string;
  author: ObjectId;
  createdAt: Date;
}

export interface Answer {
  _id?: ObjectId;
  content: string;
  author: ObjectId;
  createdAt: Date;
  votes: number;
  comments: ObjectId[];
}

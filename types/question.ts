export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  createdAt: string;
}

export interface Answer {
  _id: string;
  content: string;
  author: User;
  createdAt: string;
  comments: Comment[];
}

export interface Question {
  data: {
    _id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    views: number;
  };
  comments: Comment[];
}

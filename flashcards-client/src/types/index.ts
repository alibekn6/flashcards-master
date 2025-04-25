export interface User {
  id: number;
  email: string;
}

export interface Folder {
  id: number;
  name: string;
}

export interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

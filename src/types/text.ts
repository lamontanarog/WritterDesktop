export interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Text {
  id: string;
  content: string;
  time: number;
  wordCount: number;
  ideaId: number;
  userId: string;
  createdAt: string;
}

export interface TextsResponse {
  data: Text[];
  total: number;
  page: number;
  totalPages: number;
} 
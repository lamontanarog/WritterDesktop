export interface Idea {
    id: string;
    title: string;
    content: string;
    userId: string;
    createdAt: string;
}

export interface IdeasResponse {
    data: Idea[];
    total: number;
    page: number;
    totalPages: number;
} 
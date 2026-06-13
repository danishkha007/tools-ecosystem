export interface PostData {
    description: string;
    name: string;
    posts: Post[];
}

export interface Post {
    id: string;
    name: string;
    route: string;
    category: string;
    type: string;
    shortDescription: string;
    description: string;
    author: string;
    date: string;
    tags: string[];
    recommendedToolIds?: string[];
    recommendedPostIds?: string[];
    style: string;
    body: string;
}

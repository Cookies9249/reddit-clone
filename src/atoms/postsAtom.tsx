// Recoil documentation: https://recoiljs.org/docs/introduction/getting-started

// Recoil state for user's selected post, displayed posts, and post votes
// Includes type for Post and PostVote

import { Timestamp } from 'firebase/firestore';
import { atom } from 'recoil';

// Type for each post
export type Post = {
    id?: string;
    communityId: string;
    creatorId: string;
    creatorDisplayName: string;
    title: string;
    body: string;
    numberOfComments: number;
    voteStatus: number;
    imageURL?: string;
    communityImageURL?: string;
    createdAt: Timestamp;
}

// Type for each vote
export type PostVote = {
    id: string;
    postId: string;
    communityId: string;
    voteValue: number;
}

// Contains all posts and all votes for user
interface PostState {
    selectedPost: Post | null;
    posts: Post[];
    postVotes: PostVote[]
}

const defaultPostState: PostState = {
    selectedPost: null,
    posts: [],
    postVotes: [],
}

export const postState = atom<PostState>({
    key: 'postState',
    default: defaultPostState,
})
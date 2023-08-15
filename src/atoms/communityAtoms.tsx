// Recoil documentation: https://recoiljs.org/docs/introduction/getting-started
import { Timestamp } from 'firebase/firestore';
import { atom } from 'recoil';

/* When creating an atom, create a type
    an interface state
    a default state
    and the exportable atom */

// Create type Community
export interface Community {
    id: string;
    creatorId: string;
    numberOfMembers: number;
    privacyType: 'public' | 'restricted' | 'private';
    createdAt?: Timestamp;
    imageURL?: string;
}

// Snippets type
export interface CommunitySnippet {
    communityId: string;
    isModerator?: boolean;
    imageURL?: string;
}

// State type
interface CommunityState {
    mySnippets: CommunitySnippet[];
    currentCommunity?: Community;
    snippetsFetched: boolean;
}

// Default state
const defaultCommunityState: CommunityState = {
    mySnippets: [],
    snippetsFetched: false,
}

// Commuity atom
export const communityState = atom<CommunityState>({
    key: 'communitiesState',
    default: defaultCommunityState,
})


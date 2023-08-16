// CONTAINS LOGIC FOR:
// Voting, selecting and deleting posts
// Automatically getting user post votes after refresh

import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Community, CommunitySnippet, communityState } from '../atoms/communityAtoms';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore, storage } from '../firebase/clientApp';
import { getDocs, collection, writeBatch, doc, increment, deleteDoc, where, query } from 'firebase/firestore';
import { authModalState } from '@/src/atoms/modalAtoms';
import { Post, PostVote, postState } from '../atoms/postsAtom';
import { deleteObject, ref } from 'firebase/storage';
import { useRouter } from 'next/navigation';

// HERE: Querying database for multiple docs

// Custom hook for using and changing data
// Used in Posts component
const usePosts = () => {

    const [postStateValue, setPostStateValue] = useRecoilState(postState);
    const currentCommunity = useRecoilValue(communityState).currentCommunity
    const [user] = useAuthState(auth);
    const setAuthModalState = useSetRecoilState(authModalState);
    const router = useRouter();

    // Vote for a post
    const onVote = async (event: React.MouseEvent<SVGElement, MouseEvent>, post: Post, vote: number, communityId: string) => {

        // Prevents overlap of events (selecting post and voting at same time)
        event.stopPropagation();

        // Validate for user
        if (!user) {
            setAuthModalState({ open: true, view: 'login' });
            return;
        }
        
        try {

            const { voteStatus } = post; 
            const batch = writeBatch(firestore);

            // Create copies (safe)
            const updatedPost = {...post};
            const updatedPosts = [...postStateValue.posts];
            let updatedPostVotes = [...postStateValue.postVotes];

            // voteChange is the change in total votes
            let voteChange = vote;

            // Check if there is an existing vote
            const existingVote = postStateValue.postVotes.find(vote => vote.postId === post.id);

            // New vote (Increment by 1 and write new vote document)
            if (!existingVote) {

                // 1: Reference to postVotes *subcollection* in user
                const postVoteRef = doc(collection(firestore, 'users', `${user.uid}/postVotes`));

                // Create object for postVotes
                const newVote: PostVote = {
                    id: postVoteRef.id,
                    postId: post.id!,
                    communityId: post.communityId,
                    voteValue: voteChange,
                }

                // Write batch to database
                batch.set(postVoteRef, newVote)

                // 2: Update post variables
                updatedPost.voteStatus = voteStatus + vote;
                updatedPostVotes = [...updatedPostVotes, newVote]                

            } else {

                const postVoteRef = doc(firestore, 'users', `${user.uid}/postVotes/${existingVote.id}`)

                // Removing vote (Increment by 1 and delete vote document)
                if (vote === existingVote.voteValue) {

                    // 1: Delete user's vote document from database
                    batch.delete(postVoteRef);

                    // 2: Update post variables
                    updatedPost.voteStatus = voteStatus - vote;
                    updatedPostVotes = updatedPostVotes.filter(vote => vote.id !== existingVote.id);

                    voteChange *= -1;

                // Flipping vote (Increment by 2 and update vote document)
                } else {
                
                    // 1: Update user's vote document
                    batch.update(postVoteRef, { voteValue: vote })

                    // 2: Update post variables 
                    updatedPost.voteStatus = voteStatus + 2 * vote;

                    const voteIndex = postStateValue.postVotes.findIndex(vote => vote.id === existingVote.id)
                    updatedPostVotes[voteIndex] = {
                        ...existingVote,
                        voteValue: vote
                    } 
                    
                    voteChange = 2 * vote
                }
            }

            // 2: Write batch to database in posts
            const postRef = doc(firestore, 'posts', post.id!);
            batch.update(postRef, { voteStatus: voteStatus + voteChange });

            // Commit batch changes
            batch.commit();

            // Updated updatedPosts variable with updatedPost
            const postIndex = postStateValue.posts.findIndex(item => item.id === post.id);
            updatedPosts[postIndex] = updatedPost;

            // Update recoil state using post variables
            setPostStateValue(prev => ({
                ...prev,
                posts: updatedPosts,
                postVotes: updatedPostVotes,
            }));

            // Update selected post if necessary
            if (postStateValue.selectedPost) {
                setPostStateValue(prev => ({
                    ...prev,
                    selectedPost: updatedPost,
                }))
            }
            
        } catch (error: any) {
            console.log('onVote error', error.message)
        }

    }

    // Viewing comments for a post
    const onSelectPost = (post: Post) => {
        
        // Store post in recoil state
        setPostStateValue(prev => ({
            ...prev,
            selectedPost: post,
        }));

        // Route to comments page
        router.push(`/r/${post.communityId}/comments/${post.id}`);
    }

    // Deleting a post
    const onDeletePost = async (post: Post): Promise<boolean> => {

        try {

            // Delete image from storage (if nescessary)
            if (post.imageURL) {
                const imageRef = ref(storage, `posts/${post.id}/image`)
                await deleteObject(imageRef);
            }

            // Delete post document from database
            const postDocRef = doc(firestore, 'posts', post.id!);
            await deleteDoc(postDocRef);

            // Update recoil state
            setPostStateValue(prev => ({
                ...prev,
                posts: prev.posts.filter(item => item.id !== post.id)
            }))

            // Return promise
            return true;
            
        } catch (error: any) {
            console.log(error.message)
            return false;
        }
    }

    // Get data (after refresh or user change)
    const getCommunityPostVote = async (communityId: string) => {
        try {

            // Get post votes for community
            const postVotesQuery = query(
                collection(firestore, 'users', `${user?.uid}/postVotes`),
                where('communityId', '==', communityId)
            );

            // Get docs from database using query
            const postVotesDocs = await getDocs(postVotesQuery);

            // Extract data from docs into objects
            const postVotes = postVotesDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Store data in recoil state
            setPostStateValue(prev => ({
                ...prev,
                postVotes: postVotes as PostVote[],
            }))

        } catch (error: any) {
            console.log('getCommunityPostVote error', error)
        }
    }

    // Calls getCommunityPostVote if valid user
    useEffect(() => {
        if (!currentCommunity?.id || !user) return;
        getCommunityPostVote(currentCommunity.id);
    }, [user, currentCommunity])

    // If there is change in user, clear post votes
    useEffect(() => {
        if (!user) {
            setPostStateValue(prev => ({
                ...prev,
                postVotes: [],
            }));
        }
    }, [user])

    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onSelectPost,
        onDeletePost,
    };
    
}
export default usePosts;
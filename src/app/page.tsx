'use client'

import Image from 'next/image'
import CreatePostLink from '../components/Community/CreatePostLink'
import PageContent from '../components/Layout/PageContent'
import useCommunityData from '../hooks/useCommunityData'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, firestore } from '../firebase/clientApp'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { Stack } from '@chakra-ui/react'
import PostItem from '../components/Posts/PostItem'
import usePosts from '../hooks/usePosts'
import { Post, PostVote } from '../atoms/postsAtom'
import PostLoader from '../components/Posts/PostLoader'
import { ref } from 'firebase/storage'
import Recommendations from '../components/Community/Recommendations'
import Premium from '../components/Community/Premium'
import PersonalHome from '../components/Community/PersonalHome'


// page.tsx instead of index.tsx in Next 13
export default function Home() {

    const { postStateValue, setPostStateValue, onVote, onSelectPost, onDeletePost } = usePosts();
    const { communityStateValue } = useCommunityData();
    const [user, loadingUser] = useAuthState(auth);
    const [loading, setLoading] = useState(false);
    
    const buildUserHomeFeed = async () => {
        setLoading(true);

        console.log('BUILDING USER DETECTED')

        try {

            // Get all communities for user
            if (communityStateValue.mySnippets.length) {
                const userCommunityIds = communityStateValue.mySnippets.map(item => item.communityId);

                // Get post votes for all posts
                const postQuery = query(
                    collection(firestore, 'posts'),
                    where('communityId', 'in', userCommunityIds),
                    orderBy('voteStatus', 'desc'),
                    limit(10));

                // Get docs from database using query
                const postDocs = await getDocs(postQuery);

                // Extract data from docs into objects
                const posts = postDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Update recoil state
                setPostStateValue(prev => ({
                    ...prev,
                    posts: posts as Post[],
                }))
                
            } 
            else {
                buildNoUserHomeFeed();
            }

        } catch (error) {
            console.log('buildUserHomeFeed error', error);
        }

        setLoading(false);
    };
    
    // Home feed when user isn't logged in
    const buildNoUserHomeFeed = async () => {
        setLoading(true);

        console.log('BUILDING NO USER DETECTED')

        try {
            
            // Get post votes for all posts
            const postQuery = query(collection(firestore, 'posts'), orderBy('voteStatus', 'desc'), limit(10));

            // Get docs from database using query
            const postDocs = await getDocs(postQuery);

            // Extract data from docs into objects
            const posts = postDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setPostStateValue(prev => ({
                ...prev,
                posts: posts as Post[],
            }))

        } catch (error) {
            console.log('buildNoUserHomeFeed error', error);
        }

        setLoading(false);
    };
    
    // If the user is logged in
    const getUserPostVotes = async () => {

        try {
            // Get ids of displayed posts
            const postIds = postStateValue.posts.map(item => item.id);
            
            // Get post votes for community
            const postVotesQuery = query(
                collection(firestore, 'users', `${user?.uid}/postVotes`),
                where('postId', 'in', postIds));

            // Get docs from database using query
            const postVotesDocs = await getDocs(postVotesQuery);

            // Extract data from docs into objects
            const postVotes = postVotesDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Update recoil state
            setPostStateValue(prev => ({
                ...prev,
                postVotes: postVotes as PostVote[],
            }))

            console.log('FETCHING USER VOTES', postStateValue.postVotes)

        } catch (error) {
            console.log('getUserPostVotes error', error);
        }

    };
    
    // Builds feed for not logged in user
    useEffect(() => {
        if (!loadingUser && !user) {
            buildNoUserHomeFeed();
        }
    }, [user, loadingUser]);

    // Builds feed for logged in user 
    useEffect(() => {
        if (communityStateValue.snippetsFetched) {
            buildUserHomeFeed();
        }
    }, [communityStateValue.snippetsFetched])

    // Calls getUserPostVotes
    useEffect(() => {
        if (user && postStateValue.posts.length) {
            getUserPostVotes();
        }
        return () => {
            setPostStateValue(prev => ({
                ...prev,
                postVotes: []
            }))
        }
    }, [user, postStateValue.posts.length])
    
    return (
        <PageContent>
            {/* Left Side: Post Feed */}
            <>
                <CreatePostLink/>

                {loading ? (
                    <PostLoader/>
                ) : (
                    <Stack>
                        {postStateValue.posts.map(item => (
                            <PostItem
                                key={item.id}
                                post={item}
                                userIsCreator={item.creatorId === user?.uid}
                                userVoteValue={postStateValue.postVotes.find(vote => vote.postId === item.id)?.voteValue}
                                onVote={onVote} onDeletePost={onDeletePost} onSelectPost={onSelectPost}
                                showCommunity
                            />
                        ))}
                    </Stack>
                )}
            </>

            {/* Right Side: Recommendations */}
            <>
            <Stack spacing='5'>
                <Recommendations/>
                <Premium/>
                <PersonalHome/>
            </Stack>
            </>
        </PageContent>
    )
}

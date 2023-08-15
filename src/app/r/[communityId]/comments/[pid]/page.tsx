'use client'

import { Community, communityState } from '@/src/atoms/communityAtoms';
import { Post } from '@/src/atoms/postsAtom';
import About from '@/src/components/Community/About';
import PageContent from '@/src/components/Layout/PageContent';
import Comments from '@/src/components/Posts/Comments/Comments';
import PostItem from '@/src/components/Posts/PostItem';
import { auth, firestore } from '@/src/firebase/clientApp';
import useCommunityData from '@/src/hooks/useCommunityData';
import usePosts from '@/src/hooks/usePosts';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue } from 'recoil';

const PostPage:React.FC = () => {

    const [user] = useAuthState(auth);
    const { postStateValue, setPostStateValue, onVote, onDeletePost, onSelectPost } = usePosts();
    const { communityStateValue } = useCommunityData();
    
    const post = postStateValue.selectedPost;
    const params = useParams();

    // Fetch post if there is a refresh
    const fetchPost = async (postId: string) => {
        
        try {
            // Fetch post from database
            const postDocRef = doc(firestore, 'posts', postId);
            const postDoc = await getDoc(postDocRef);

            // Convert data into object
            const data = { id: postDoc.id, ...postDoc.data() }

            // Update post recoil state
            setPostStateValue(prev => ({
                ...prev, 
                selectedPost: data as Post
            }))
            
        } catch (error) {
            console.log('fetchPost error', error)
        }
    }

    // Calls fetchPost if there is a post in URL and no selected post value
    useEffect(() => {

        if (params.pid && !postStateValue.selectedPost) {
            fetchPost(params.pid)
        }

    }, [params, postStateValue.selectedPost])
    
    return(

        <PageContent>
            {/* Left Side */}
            <>
                {post && (
                    <>
                        <PostItem post={post}
                            userIsCreator={user?.uid === post.creatorId}
                            key={post.id}
                            userVoteValue={postStateValue.postVotes.find(vote => vote.postId === post.id)?.voteValue}
                            onVote={onVote} onDeletePost={onDeletePost}
                            showCommunity
                        />

                        <Comments user={user as User} selectedPost={post} communityId={post.communityId}/>
                    </>
                )}

            </>

            {/* Right Side */}
            <>
                {communityStateValue.currentCommunity && <About communityData={communityStateValue.currentCommunity}/>}
            </>
        </PageContent>

    )

}
export default PostPage;
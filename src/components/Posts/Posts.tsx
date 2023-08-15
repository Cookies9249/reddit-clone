import { Community } from '@/src/atoms/communityAtoms';
import { Post } from '@/src/atoms/postsAtom';
import { auth, firestore } from '@/src/firebase/clientApp';
import usePosts from '@/src/hooks/usePosts';
import { Stack } from '@chakra-ui/react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import PostItem from './PostItem';
import PostLoader from './PostLoader';

type PostsProps = {
    communityData: Community;
};

const Posts:React.FC<PostsProps> = ({ communityData }) => {

    // Regular hooks
    const [user] = useAuthState(auth)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    // usePosts hook (hooks/usePosts.tsx)
    const { postStateValue, setPostStateValue, onVote, onDeletePost, onSelectPost } = usePosts();

    // copy similar structure to loading community

    const getPosts = async () => {
        setLoading(true);
        
        try {
            // Get posts for community
            const postsQuery = query(
                collection(firestore, 'posts'),
                where('communityId', '==', communityData.id),
                orderBy('createdAt', 'desc')
            )

            // Get docs of query items
            const postDocs = await getDocs(postsQuery);

            // Get objects for posts, store in post state
            const posts = postDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            console.log('posts', posts);

            // Store in post state
            setPostStateValue(prev => ({
                ...prev,
                posts: posts as Post[]
            }));
            

        } catch (error: any) {
            console.log('getPosts error', error.message)
        }
        setLoading(false);
    };

    useEffect(() => {
        getPosts();
    }, [communityData])
    
    return (
        <>
            { loading ? ( 
                // Return skeleton if loading
                <PostLoader/>
            ) : (
                // Return posts if loaded
                <Stack>
                    {postStateValue.posts.map(item => (
                        <PostItem
                            key={item.id}
                            post={item}
                            userIsCreator={item.creatorId === user?.uid}
                            userVoteValue={postStateValue.postVotes.find(vote => vote.postId === item.id)?.voteValue}
                            onVote={onVote} onDeletePost={onDeletePost} onSelectPost={onSelectPost}
                        />
                    ))}
                </Stack>
            )}
            
        </>
    )
}
export default Posts;
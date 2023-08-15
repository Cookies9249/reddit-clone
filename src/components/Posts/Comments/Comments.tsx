import { Post, postState } from '@/src/atoms/postsAtom';
import { Box, Flex, SkeletonCircle, SkeletonText, Stack, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import CommentInput from './CommentInput';
import { Timestamp, addDoc, collection, doc, getDocs, increment, orderBy, query, serverTimestamp, where, writeBatch } from 'firebase/firestore';
import { firestore } from '@/src/firebase/clientApp';
import { useRecoilState, useSetRecoilState } from 'recoil';
import CommentItem, { Comment } from './CommentItem';

// Similar to usePosts.tsx : Votes vs. Comments

type CommentsProps = {
    user: User;
    selectedPost: Post;
    communityId: string;
};

const Comments:React.FC<CommentsProps> = ({ user, selectedPost, communityId }) => {

    // Local states
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);

    // Loading states
    const [fetchLoading, setFetchLoading] = useState(true);
    const [createLoading, setCreateLoading] = useState(false);
    const [deleteLoadingId, setDeleteLoadingId] = useState('');

    // Recoil states
    const setPostStateValue = useSetRecoilState(postState);
    
    /* Batched Writes
    
    Intialize: `const batch = writeBatch(firestore)`
    Commit: `batch.commit()`

    Using Batched Writes:

    Variables:

    Write:
    const dataRef = doc(collection(firestore, collection_name));
    const newData: Type = {
        id: dataRef.id,
        ...
    };
    batch.set(dataRef, newData);

    Update:
    const dataRef = doc(firestore, collection_name, doc_name);
    batch.update(dataRef, { field_to_update: new_value });
    
    Delete:
    const dataRef = doc(firestore, collection_name, doc_name);
    batch.delete(dataRef);
    */

    // Handles creating comments
    const onCreateComment = async () => {

        setCreateLoading(true);
        try {
            const batch = writeBatch(firestore);

            // Create document reference
            const commentDocRef = doc(collection(firestore, 'comments'));

            // Create a comment object
            const newComment: Comment = {
                id: commentDocRef.id,
                creatorId: user.uid,
                creatorDisplayText: user.email!.split('@')[0],
                communityId: communityId,
                postId: selectedPost.id!,
                postTitle: selectedPost.title,
                text: commentText,
                createdAt: serverTimestamp() as Timestamp,
            };
            newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp

            // Write to database
            batch.set(commentDocRef, newComment);

            // Update number of comments in post
            const postDocRef = doc(firestore, 'posts', selectedPost.id!);
            batch.update(postDocRef, { numberOfComments: increment(1) })

            await batch.commit();

            // Update local and recoil states
            setCommentText('');
            setComments(prev => [newComment, ...prev]);

            setPostStateValue(prev => ({
                ...prev, 
                selectedPost: {
                    ...prev.selectedPost,
                    numberOfComments: prev.selectedPost?.numberOfComments! + 1
                } as Post
            }))

        } catch (error) {
            console.log('onCreateComment error', error)
        }
        setCreateLoading(false);

    };

    // Handles deleting comments
    const onDeleteComment = async (comment: Comment) => {

        setDeleteLoadingId(comment.id);
        try {
            const batch = writeBatch(firestore);
    
            // Delete comment document
            const commentDocRef = doc(firestore, 'comments', comment.id);
            batch.delete(commentDocRef);
    
            // Update number of comments
            const postDocRef = doc(firestore, 'posts', selectedPost.id!);
            batch.update(postDocRef, { numberOfComments: increment(-1) })
    
            await batch.commit();
    
            // Update local and recoil states
            setComments(prev => prev.filter(item => item.id !== comment.id));
    
            setPostStateValue(prev => ({
                ...prev, 
                selectedPost: {
                    ...prev.selectedPost,
                    numberOfComments: prev.selectedPost?.numberOfComments! - 1
                } as Post
            }))
    
        } catch (error) {
            console.log('onDeleteComment error', error);
        }
        setDeleteLoadingId('');

    };

    // Fetch comment data from firestore
    const getPostComments = async () => {

        try {
            // Get document from database
            const commentQuery = query(
                collection(firestore, 'comments'),
                where('postId', '==', selectedPost.id),
                orderBy('createdAt', 'desc')
            )
    
            // Get comment documents
            const commentDocs = await getDocs(commentQuery);
    
            // Convert data to object
            const commentData = commentDocs.docs.map(item => ({ id: item.id, ...item.data() }));
    
            // Store to comments array
            setComments(commentData as Comment[]);
            
        } catch (error) {
            console.log('getPostComments error', error);
        }
        setFetchLoading(false);

    };

    useEffect(() => {
        if (!selectedPost) return;
        getPostComments();
    }, [selectedPost]);

    return (
        <Box bg='white' borderRadius='0px 0px 4px 4px' p='2'>

            {/* Text input for comment */}
            {!fetchLoading && (
                <Flex direction='column' pl='10' pr='4' fontSize='10pt' width='100%'>
                    <CommentInput commentText={commentText} setCommentText={setCommentText} user={user} createLoading={createLoading} onCreateComment={onCreateComment}/>
                </Flex>
            )}

            {/* Displaying comments */}
            <Stack spacing='6' mt='6' p='2'>

                {fetchLoading ? (
                    // Skeleton for loading
                    <>
                    {[0, 1, 2].map(item => (
                        <Box key={item} padding='6' bg='white'>
                            <SkeletonCircle size='10'/>
                            <SkeletonText mt='4' noOfLines={2} spacing='4'/>
                        </Box>
                    ))}
                    </>
                ) : (
                    <>
                    {comments.length === 0 ? (
                        // If there are no comments
                        <Flex direction='column' justify='center' align='center' borderTop='1px solid' borderColor='gray.100' p='20'>
                            <Text fontWeight='700' opacity='0.3'>No Comments Yet</Text>
                        </Flex>

                    ) : (
                        // Comment display
                        <>
                        {comments.map(item => (
                            <CommentItem key={item.id} comment={item} onDeleteComment={onDeleteComment} loadingDelete={deleteLoadingId === item.id} userId={user.uid}/>
                        ))}
                        </>
                    )}
                    </>
                )}                
            </Stack>
        </Box>
    )
}
export default Comments;
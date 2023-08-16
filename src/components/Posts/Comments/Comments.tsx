// Displays comment section under a post
// Uses CommentInput and CommentItem
// Used in post page
// Contains all logic for creating and deleting comments, using batched writes

import { Post, postState } from '@/src/atoms/postsAtom';
import { Box, Flex, SkeletonCircle, SkeletonText, Stack, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import CommentInput from './CommentInput';
import { Timestamp, WriteBatch, collection, doc, getDocs, increment, orderBy, query, serverTimestamp, where, writeBatch } from 'firebase/firestore';
import { firestore } from '@/src/firebase/clientApp';
import { useSetRecoilState } from 'recoil';
import CommentItem, { Comment } from './CommentItem';

type CommentsProps = {
    user: User;
    selectedPost: Post;
    communityId: string;
};

const Comments:React.FC<CommentsProps> = ({ user, selectedPost, communityId }) => {

    // Local states
    const [mainCommentText, setMainCommentText] = useState('');

    // Comments state
    const [allComments, setAllComments] = useState<Comment[]>([]);

    // Loading states
    const [fetchLoading, setFetchLoading] = useState(true);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [deleteLoadingId, setDeleteLoadingId] = useState('');

    // Recoil states
    const setPostStateValue = useSetRecoilState(postState);

    // Handles creating comments
    const onCreateComment = async (text: string, layer: number, resetInput: () => void, parentId?: string) => {

        setLoadingCreate(true);
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
                text: text,
                createdAt: serverTimestamp() as Timestamp,
                layer: layer,
                parentId: parentId ?? '',
            };
            newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp

            // Write to database
            batch.set(commentDocRef, newComment);

            // Update number of comments in post
            const postDocRef = doc(firestore, 'posts', selectedPost.id!);
            batch.update(postDocRef, { numberOfComments: increment(1) })

            // Update local and recoil states
            resetInput();
            setAllComments(prev => [newComment, ...prev]);

            // Update number of comments
            setPostStateValue(prev => ({
                ...prev, 
                selectedPost: {
                    ...prev.selectedPost,
                    numberOfComments: prev.selectedPost?.numberOfComments! + 1
                } as Post
            }))

            await batch.commit();

        } catch (error) {
            console.log('onCreateComment error', error)
        }
        setLoadingCreate(false);

    };

    // Handles deleting comments
    const onDeleteComment = async (comment: Comment) => {

        setDeleteLoadingId(comment.id);
        try {
            // Initialize batched writes with firestore
            const batch = writeBatch(firestore);

            // Check if comment has subcomments
            const subComments = allComments.filter(item => (item.parentId === comment.id));

            if (subComments.length) {

                // If there are subcomments: update comment to [deleted]
                const commentDocRef = doc(firestore, 'comments', comment.id);

                const newCommentData: Comment = {
                    ...comment,
                    creatorId: '',
                    creatorDisplayText: '[deleted]',
                    text: '[deleted]',
                    createdAt: null,
                }

                // Update database and react state
                batch.update(commentDocRef, newCommentData);
                const allCommentsIndex = allComments.findIndex(item => item.id === comment.id)
                allComments[allCommentsIndex] = newCommentData;

            }
            else {
                // If there are no subcomments: delete comment
                await onDeleteCommentNoSubComments(batch, comment);
            }
    
            // Update number of comments (-1 for original comment)
            const postDocRef = doc(firestore, 'posts', selectedPost.id!);
            batch.update(postDocRef, { numberOfComments: increment(-1) })

            setPostStateValue(prev => ({
                ...prev, 
                selectedPost: {
                    ...prev.selectedPost,
                    numberOfComments: prev.selectedPost?.numberOfComments! - 1
                } as Post
            }));

            await batch.commit();
    
        } catch (error) {
            console.log('onDeleteComment error', error);
        }

        setDeleteLoadingId('');
    };

    // Deletes comment (if it has no comments), checks for deletion of [deleted] parent comments (recursive)
    const onDeleteCommentNoSubComments = async (batch: WriteBatch, comment: Comment) => {

        // Delete the original comment
        const commentDocRef = doc(firestore, 'comments', comment.id);
        batch.delete(commentDocRef);
        setAllComments(prev => prev.filter(item => item.id !== comment.id));

        // Check for parent comments that are [deleted]
        const deletedParentComments = allComments.filter(item => (item.id === comment.parentId && !item.creatorId)); 

        // If a parent comment is [deleted], delete them
        if (deletedParentComments.length) {

            // Cancel if parent comment has other subcomments
            const deletedParentSubComments = allComments.filter(item => (item.parentId === deletedParentComments[0].id));
            
            if (deletedParentSubComments.length > 1) {
                return;
            }

            // Delete comment
            onDeleteCommentNoSubComments(batch, deletedParentComments[0]);
        }
    }

    // Fetch comment data from firestore
    const getPostComments = async () => {

        console.log('getPostComments called')

        try {
            // Get all comments database
            const allCommentsQuery = query(
                collection(firestore, 'comments'),
                where('postId', '==', selectedPost.id),
                orderBy('createdAt', 'desc')
            );
            const allCommentsDocs = await getDocs(allCommentsQuery);
            const allCommentsData = allCommentsDocs.docs.map(item => ({ id: item.id, ...item.data() }));
            setAllComments(allCommentsData as Comment[]);
            
        } catch (error) {
            console.log('getPostComments error', error);
        }
        setFetchLoading(false);

    };

    // Get post comments when post changes
    useEffect(() => {
        if (!selectedPost) return;
        getPostComments();
    }, [selectedPost.id]);

    return (
        <Box bg='white' borderRadius='0px 0px 4px 4px' p='2'>

            {/* Text input for comment */}
            {!fetchLoading && (
                <Flex direction='column' pl='10' pr='4' fontSize='10pt' width='100%'>
                    <CommentInput user={user} layer={0}
                        commentText={mainCommentText} setCommentText={setMainCommentText}
                        onCreateComment={onCreateComment} loadingCreate={loadingCreate}
                        resetInput={() => setMainCommentText('')}/>
                </Flex>
            )}

            {/* Displaying comments */}
            <Stack p='2'>

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
                    {allComments.length === 0 ? (
                        // If there are no comments
                        <Flex direction='column' justify='center' align='center' borderTop='1px solid' borderColor='gray.100' p='20'>
                            <Text fontWeight='700' opacity='0.3'>No Comments Yet</Text>
                        </Flex>

                    ) : (
                        // Comment display
                        <>
                        {allComments.filter(item => item.layer === 0).map(item => (
                            <CommentItem key={item.id} comment={item} user={user}
                                onDeleteComment={onDeleteComment} loadingDelete={deleteLoadingId === item.id} 
                                onCreateComment={onCreateComment} allComments={allComments} deleteLoadingId={deleteLoadingId}/>
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
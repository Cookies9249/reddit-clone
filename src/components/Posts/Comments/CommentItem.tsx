// Item for each comment in a post
// Used in Comments.tsx
// Comment deleting logic in Comments.tsx

import { Box, Divider, Flex, Icon, Spinner, Stack, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
import React, { useState } from 'react';
import { FaReddit } from 'react-icons/fa';
import { IoArrowDownCircleOutline, IoArrowUpCircleOutline } from 'react-icons/io5'
import CommentInput from './CommentInput';
import { authModalState } from '@/src/atoms/modalAtoms';
import { useSetRecoilState } from 'recoil';


type CommentItemProps = {
    comment: Comment;
    user?: User;

    onDeleteComment: (comment: Comment) => void;
    loadingDelete: boolean;
    
    onCreateComment: (text: string, layer: number, resetInput: () => void, parentId?: string ) => Promise<void>;
    allComments: Comment[];
    deleteLoadingId: string;
};

export type Comment = {
    id: string;
    creatorId: string;
    creatorDisplayText: string;
    communityId: string;
    postId: string;
    postTitle: string;
    text: string;
    createdAt: Timestamp | null;
    layer: number;
    parentId?: string;
}

const CommentItem:React.FC<CommentItemProps> = ({ comment, user, onDeleteComment, loadingDelete, onCreateComment, allComments, deleteLoadingId }) => {
    
    // Nexted comment functionality
    const [isReplying, setIsReplying] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [loadingCreate, setLoadingCreate] = useState(false); // ADD FUNCTIONALITY

    const setAuthModalState = useSetRecoilState(authModalState);

    const subComments = allComments.filter(item => (item.parentId === comment.id))
    // console.log(`COMMENTS LENGTH ${subComments.length}`, subComments)

    return (
        <Flex direction='column' mt='4'>

            <Flex>
                {/* Reddit icon */}
                <Box mr='2'>
                    <Icon as={FaReddit} fontSize='30' color='gray.300'/>
                </Box>

                <Stack spacing='1'>

                    {/* User and time text */}
                    <Stack direction='row' align='center' fontSize='8pt'>
                        <Text fontWeight='700'>{comment.creatorDisplayText}</Text>

                        {comment.createdAt && (
                            <Text color='gray.600'>{moment(new Date(comment.createdAt.seconds * 1000)).fromNow()}</Text>
                        )}

                        {/* Spinner for deleting */}    
                        { loadingDelete && <Spinner size='sm'/> }
                    </Stack>

                    {/* Comment text */}
                    <Text fontSize='10pt'>{comment.text}</Text>

                    {/* User actions */}
                    <Stack direction='row' align='center' cursor='pointer' color='gray.500'>

                        {/* Upvote and downvote */}
                        <Icon as={IoArrowUpCircleOutline}/>
                        <Icon as={IoArrowDownCircleOutline}/>

                        {/* Reply */}
                        { comment.layer < 8 && (
                            <Text fontSize='9pt' _hover={{ color: 'blue.500' }}
                                onClick={ user ? () => setIsReplying(!isReplying) : () => setAuthModalState({ open: true, view: 'login' })}>
                                Reply
                            </Text>
                        )}

                        {/* Edit and delete options */}
                        {user?.uid === comment.creatorId && (
                            <>
                            <Text fontSize='9pt' _hover={{ color: 'blue.500' }}>
                                Edit
                            </Text>
                            
                            <Text fontSize='9pt' _hover={{ color: 'blue.500' }}
                                onClick={() => onDeleteComment(comment)}>
                                Delete
                            </Text>
                            </>
                        )}

                    </Stack>
                </Stack>
            </Flex>

            {/* Reply input if necessary */}
            { isReplying && user && (
                <CommentInput user={user} layer={comment.layer+1}
                    commentText={commentText} setCommentText={setCommentText}
                    onCreateComment={onCreateComment} loadingCreate={loadingCreate}
                    parentId={comment.id} resetInput={() => {
                        setIsReplying(false);
                        setCommentText('');
                }}/>
            )}

            {/* Display sub-comments */}
            {!!subComments.length && (
                <Flex direction='row' border='1px solid red'>
                    
                    <Flex pl='13px' pr='6px' borderColor='gray.300'>
                        <Divider orientation='vertical' borderLeftWidth={2}/>
                    </Flex>

                    <Flex direction='column' width='100%' border='1px solid red'>
                        {subComments.map(item => (
                            <CommentItem key={item.id} comment={item} user={user}
                                onDeleteComment={onDeleteComment} loadingDelete={deleteLoadingId === item.id} 
                                onCreateComment={onCreateComment} allComments={allComments} deleteLoadingId={deleteLoadingId}/>
                        ))}
                    </Flex>

                </Flex>
            )}
            
        </Flex>

    )
}
export default CommentItem;
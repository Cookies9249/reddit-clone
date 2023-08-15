import { Box, Flex, Icon, Spinner, Stack, Text } from '@chakra-ui/react';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment';
import React from 'react';
import { FaReddit } from 'react-icons/fa';
import { IoArrowDownCircleOutline, IoArrowUpCircleOutline } from 'react-icons/io5'

type CommentItemProps = {
    comment: Comment;
    onDeleteComment: (comment: Comment) => void;
    loadingDelete: boolean;
    userId: string;
};

export type Comment = {
    id: string;
    creatorId: string;
    creatorDisplayText: string;
    communityId: string;
    postId: string;
    postTitle: string;
    text: string;
    createdAt: Timestamp;
}

const CommentItem:React.FC<CommentItemProps> = ({ comment, onDeleteComment, loadingDelete, userId }) => {
    
    return (

        <Flex>

            {/* Reddit icon */}
            <Box mr='2'>
                <Icon as={FaReddit} fontSize='30' color='gray.300'/>
            </Box>

            <Stack spacing='1'>

                {/* User and time text */}
                <Stack direction='row' align='center' fontSize='8pt'>
                    <Text fontWeight='700'>{comment.creatorDisplayText}</Text>
                    <Text color='gray.600'>{moment(new Date(comment.createdAt.seconds * 1000)).fromNow()}</Text>

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

                    {/* Edit and delete options */}
                    {userId === comment.creatorId && (
                        <>
                            <Text fontSize='9pt'
                                _hover={{ color: 'blue.500' }}
                            >
                                Edit
                            </Text>
                            
                            
                            <Text fontSize='9pt'
                                _hover={{ color: 'blue.500' }}
                                onClick={() => onDeleteComment(comment)}
                            >
                                Delete
                            </Text>
                        </>
                    )}


                </Stack>

            </Stack>

        </Flex>

    )
}
export default CommentItem;
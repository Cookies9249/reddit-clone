// Input for creating a new comment for a post
// Used in Comments.tsx
// Comment logic is located in Comments.tsx (setCommentText and onCreateComment)

import { Button, Flex, Text, Textarea } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React from 'react';
import AuthButtons from '../../Navbar/RightContent/AuthButtons';

type CommentInputProps = {
    commentText: string;
    setCommentText: (value: string) => void;
    user: User;
    createLoading: boolean;
    onCreateComment: (commentText: string) => void;
};

const CommentInput:React.FC<CommentInputProps> = ({ commentText, setCommentText, user, createLoading, onCreateComment }) => {
    
    return (
        <Flex direction="column" position="relative">
        
            {user ? (

                // If user is logged in, show the comment input
                <>
                    <Text mb={1}>
                        Comment as{" "}
                        <span style={{ color: "#3182CE" }}>
                            {user?.email?.split("@")[0]}
                        </span>
                    </Text>
                
                    {/* Text input */}
                    <Textarea value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        placeholder="What are your thoughts?"
                        fontSize="10pt" borderRadius='4' minHeight="160px" pb='10'
                        _placeholder={{ color: "gray.500" }}
                        _focus={{ outline: "none", bg: "white", border: "1px solid black" }}
                    />

                    {/* Comment button */}
                    <Flex position="absolute" left="1px" right='0.1' bottom="1px" justify="flex-end" bg="gray.100" p="6px 8px" borderRadius="0px 0px 4px 4px">
                        
                        <Button height="26px"
                            isDisabled={!commentText.length} isLoading={createLoading}
                            onClick={() => onCreateComment(commentText)}
                        >
                            Comment
                        </Button>

                    </Flex>

                </>
            ) : (

                // Text is user is not logged in
                <Flex align="center" justify="space-between" borderRadius='4' border="1px solid" borderColor="gray.100" p='4'>
                    <Text fontWeight='600'>Log in or sign up to leave a comment</Text>
                    <AuthButtons />
                </Flex>
            )}
        </Flex>
    )
}
export default CommentInput;
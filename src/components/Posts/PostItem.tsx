// Component for item for each post
// Used in Posts.tsx and posts page
// Voting, deleting, and selection logic located in usePosts()

import { Post } from '@/src/atoms/postsAtom';
import { Alert, AlertIcon, Box, Flex, Icon, Image, Link, Skeleton, Spinner, Stack, Text } from '@chakra-ui/react';
import moment from 'moment';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

// Icon imports
import { AiOutlineDelete } from 'react-icons/ai';
import { BsChat, BsDot } from 'react-icons/bs';
import { FaReddit } from 'react-icons/fa';
import { IoArrowDownCircleOutline, IoArrowDownCircleSharp, IoArrowRedoOutline, IoArrowUpCircleOutline, IoArrowUpCircleSharp, IoBookmarkOutline } from 'react-icons/io5';

type PostItemProps = {
    post: Post;
    userIsCreator: boolean;
    userVoteValue?: number;
    onVote: (event: React.MouseEvent<SVGElement, MouseEvent>, post: Post, vote: number, communityId: string) => void;
    onDeletePost: (post: Post) => Promise<boolean>;
    onSelectPost?: (post: Post) => void;
    showCommunity?: boolean;
};

const PostItem:React.FC<PostItemProps> = ({ post, userIsCreator, userVoteValue, onVote, onDeletePost, onSelectPost, showCommunity }) => {

    const [loadingImage, setLoadingImage] = useState(true)
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [error, setError] = useState(false);
    const router = useRouter();
    const params = useParams();
    const singlePostPage = !onSelectPost;

    // Event is automatically passed through
    const handleDelete = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

        // Prevent event overlap
        event.stopPropagation();

        setLoadingDelete(true);
        try {
            // Call delete post function
            const success = await onDeletePost(post);

            if (!success) {
                throw new Error('Failed to delete post.')
            }

            console.log('Post was successfully deleted.')

            if (singlePostPage) {
                router.push(`/r/${post.communityId}`)
            }
            
        } catch (error: any) {
            console.log('handleDelete error', error.message)
            setError(error.message);
        }
        setLoadingDelete(false);
    };
    
    return (
        <Flex border='1px solid' bg='white'
            borderRadius={singlePostPage ? '4px 4px 0px 0px' : '4px' }
            borderColor={singlePostPage ? 'white' : 'gray.300' }
            _hover={{ borderColor: singlePostPage ? 'none' : 'gray.500' }}
            cursor={singlePostPage ? 'unset' : 'pointer'}
            onClick={() => onSelectPost?.(post)}
        >

            {/* Lefthand column for voting */}
            <Flex direction='column' align='center' p='2' width='40px' 
                bg={singlePostPage ? 'none' : 'gray.100'}
                borderRadius={singlePostPage ? '0px' : '3px 0px 0px 3px'}
            >

                {/* Error Alert */}
                { error && (
                    <Alert status='error'>
                        <AlertIcon />
                        <Text mr='2'>{error}</Text>
                    </Alert>
                )}

                {/* Upvote */}
                <Icon as={ userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline }
                    color={ userVoteValue === 1 ? 'brand.100' : 'gray.400' }
                    fontSize='22'
                    onClick={(event) => onVote(event, post, 1, post.communityId)}
                />

                {/* Total votes */}
                <Text fontSize='9pt'>{post.voteStatus}</Text>

                {/* Downvote */}
                <Icon as={ userVoteValue === -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline }
                    color={ userVoteValue === -1 ? '#4379ff' : 'gray.400' }
                    fontSize='22'
                    onClick={(event) => onVote(event, post, -1, post.communityId)}
                />

            </Flex>

            {/* Righthand side for post */}
            <Flex direction='column' width='100%'>
                <Stack spacing='1' p='10px'>

                    {/* Post creation info */}
                    <Stack direction='row' spacing='0.6' align='center' fontSize='9pt'>
                        
                        {/* Community info if on home page */}
                        { showCommunity && (
                            <>
                                {post.communityImageURL ? (
                                    <Image src={post.communityImageURL} borderRadius='full' boxSize='18px' mr='1'/>
                                ) : (
                                    <Icon as={FaReddit} fontSize='18px' color='blue.500' mr='1'/>
                                )}

                                <Link href={`/r/${post.communityId}`}>
                                    <Text fontWeight='700'
                                        _hover={{ textDecoration: 'underline' }}
                                        onClick={event => event.stopPropagation()}
                                    >
                                        r/{post.communityId}
                                    </Text>
                                </Link>
                                <Icon as={BsDot} color='gray.500' fontSize='8'/>
                            </>
                        )}

                        <Text>Posted by u/{post.creatorDisplayName} {moment(new Date(post.createdAt.seconds * 1000)).fromNow()}</Text>
                    </Stack>

                    {/* Text display */}
                    <Text fontSize='12pt' fontWeight='600'>{post.title}</Text>
                    <Text fontSize='10pt'>{post.body}</Text>

                    {/* Image display */}
                    {post.imageURL && (
                        <Flex justify='center' align='center' p='2'>
                            { loadingImage && (
                                <Skeleton height='200px' width='100%' borderRadius='4'/>
                            )}
                            <Image src={post.imageURL} maxHeight='460px' alt='Post Image'
                                display={ loadingImage ? 'none' : 'unset' }
                                onLoad={() => setLoadingImage(false)}
                            />
                        </Flex> 
                    )}

                    {/* Post footer */}
                    <Flex ml='0.5' mb='0.5' color='gray.500'>

                        {/* Comments */}
                        <Flex align='center' p='8px 10px' borderRadius='4' _hover={{ bg: 'gray.200' }} cursor='pointer'>
                            <Icon mr='2' as={BsChat}/>
                            <Text fontSize='9pt'>{post.numberOfComments}</Text>
                        </Flex>

                        {/* Share */}
                        <Flex align='center' p='8px 10px' borderRadius='4' _hover={{ bg: 'gray.200' }} cursor='pointer'>
                            <Icon mr='2' as={IoArrowRedoOutline}/>
                            <Text fontSize='9pt'>Share</Text>
                        </Flex>

                        {/* Save */}
                        <Flex align='center' p='8px 10px' borderRadius='4' _hover={{ bg: 'gray.200' }} cursor='pointer'>
                            <Icon mr='2' as={IoBookmarkOutline}/>
                            <Text fontSize='9pt'>Save</Text>
                        </Flex>

                        {/* Delete */}
                        { userIsCreator && (
                            <Flex align='center' p='8px 10px' borderRadius='4' _hover={{ bg: 'gray.200' }} cursor='pointer' onClick={handleDelete}>
                                { loadingDelete ? <Spinner size='sm'/> : (
                                    <>
                                        <Icon mr='2' as={AiOutlineDelete}/>
                                        <Text fontSize='9pt'>Delete</Text>  
                                    </>
                                )}
                            </Flex>
                        )}

                    </Flex>

                </Stack>
            </Flex>
        </Flex>
    )
}
export default PostItem;
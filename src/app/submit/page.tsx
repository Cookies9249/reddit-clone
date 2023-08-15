'use client'

import { communityState } from '@/src/atoms/communityAtoms';
import About from '@/src/components/Community/Sidebar/About';
import PostingToReddit from '@/src/components/Community/Sidebar/PostingToReddit';
import PageContent from '@/src/components/Layout/PageContent';
import NewPostForm from '@/src/components/Posts/NewPostForm';
import { auth } from '@/src/firebase/clientApp';
import useCommunityData from '@/src/hooks/useCommunityData';
import { Box, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';

const SubmitPostPage:React.FC = () => {
    
    const [user] = useAuthState(auth);
    const { communityStateValue } = useCommunityData();
    console.log('COMMUNITY', communityStateValue);

    return (

        <PageContent>

            {/* Left Side */}
            <>
                <Box p='14px 0px' borderBottom='1px solid' borderColor='white'>
                    <Text>Create a Post</Text>
                </Box>

                { user && <NewPostForm user={user}/>}
            </>

            {/* Right Side: Posting Rules */}
            <>
            <Stack spacing='4' mt='12'>
                <PostingToReddit/>

                <>
                    <Text fontSize='8pt'>
                        Please be mindful of reddit's{' '}
                        <Link color='blue.500' href={'https://www.redditinc.com/policies/content-policy'}>
                            content policy
                        </Link>
                        {' '}and practice good{' '}
                        <Link color='blue.500' href={'https://www.reddit.com/wiki/reddiquette/'}>
                            reddiquette
                        </Link>
                        .
                    </Text>
                </>
            </Stack>
            </>

        </PageContent>
        
    )
}
export default SubmitPostPage;
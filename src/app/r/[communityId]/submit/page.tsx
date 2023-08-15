'use client'

import { communityState } from '@/src/atoms/communityAtoms';
import About from '@/src/components/Community/Sidebar/About';
import PageContent from '@/src/components/Layout/PageContent';
import NewPostForm from '@/src/components/Posts/NewPostForm';
import { auth } from '@/src/firebase/clientApp';
import useCommunityData from '@/src/hooks/useCommunityData';
import { Box, Text } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';

const SubmitCommunityPostPage:React.FC = () => {
    
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

                { user && <NewPostForm user={user} communityImageURL={communityStateValue.currentCommunity?.imageURL}/>}
            </>

            {/* Right Side */}
            <>
                {communityStateValue.currentCommunity && <About communityData={communityStateValue.currentCommunity}/>}
            </>

        </PageContent>
        
    )
}
export default SubmitCommunityPostPage;
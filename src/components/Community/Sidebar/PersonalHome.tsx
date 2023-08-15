import { communityModalState } from '@/src/atoms/modalAtoms';
import { Button, Divider, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaReddit } from 'react-icons/fa';
import { useSetRecoilState } from 'recoil';

const PersonalHome:React.FC = () => {

    const setCommunityModalStateOpen = useSetRecoilState(communityModalState);
    const router = useRouter();
    
    return (
        <Flex direction='column' bg='white' borderRadius='4' cursor='pointer' border='1px solid' borderColor='gray.300' position='sticky'>
            <Flex align='flex-end' color='white' p='6px 10px'
                bg='blue.500' height='34px' borderRadius='4px 4px 0px 0px' fontWeight='600' 
                bgImage='url(/images/redditPersonalHome.png)' backgroundSize='cover'
            ></Flex>

            <Flex direction='column' p='12px'>
                <Flex align='center' mb='2'>
                    <Icon as={FaReddit} fontSize='50' color='brand.100' mr='2'/>
                    <Text fontWeight='600'>Home</Text>
                </Flex>
                <Stack spacing='3'>
                    <Text fontSize='13px'>
                        Your personal Reddit frontpage. Come here to check in with your favorite communities.
                    </Text>

                    <Divider/>

                    {/* Buttons */}
                    <Button height='30px'>
                        Create Post
                    </Button>
                    <Button variant='outline' height='30px' onClick={() => {setCommunityModalStateOpen(true)}}>
                        Create Community
                    </Button>
                </Stack>
            </Flex>
        </Flex>
    )
}
export default PersonalHome;
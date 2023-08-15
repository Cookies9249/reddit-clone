import { Community } from '@/src/atoms/communityAtoms';
import useCommunityData from '@/src/hooks/useCommunityData';
import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { FaReddit } from 'react-icons/fa';

type HeaderProps = {
    communityData: Community;
};

const Header:React.FC<HeaderProps> = ({ communityData }) => {

    // Use created hook
    const { communityStateValue, onJoinOrLeaveCommunity, loading } = useCommunityData();

    // changes based on community snippet
    const isJoined = !!communityStateValue.mySnippets.find(item => item.communityId === communityData.id)
    // !! to booleanize value
    
    return (
        <Flex direction='column' width='100%' height='146px'>
            
            <Box height='50%' bg='blue.400'/>
            <Flex justify='center' bg='white' flexGrow='1'>
                <Flex width='95%' maxWidth='860px'>

                    {/* Community Icon */}
                    {communityStateValue.currentCommunity?.imageURL ? (
                        <Image src={communityStateValue.currentCommunity?.imageURL}
                            position='relative' top='-3' borderRadius='full' boxSize='66px' border='4px solid white' alt='Community Image' color='blue.500'
                        />
                    ) : (
                        <Icon as={FaReddit} fontSize='64' position='relative' top='-3' color='blue.500' border='4px solid white' borderRadius='50%'/>
                    )}

                    {/* Community Name */}
                    <Flex padding='10px 16px'>
                        <Flex direction='column' mr='6'>
                            <Text fontWeight='800' fontSize='16pt'>{ communityData.id }</Text> 
                            <Text fontWeight='600' fontSize='10pt' color='gray.400'>r/{ communityData.id }</Text> 
                        </Flex>

                        {/* Join Community Button */}
                        <Button height='30px' pr='6' pl='6'
                            variant={ isJoined ? 'outline' : 'solid'}
                            isLoading={loading}
                            onClick={() => { onJoinOrLeaveCommunity(communityData, isJoined) }}
                        >
                            { isJoined ? "Joined" : "Join" }
                        </Button>

                    </Flex>
                    

                </Flex>
            </Flex>

        </Flex>
    )
}
export default Header;
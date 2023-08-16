// Items in community directory
// Used in Directory.tsx

// Uses CreateCommunityModal.tsx, contains logic for open/close using communityModalState from atoms/modalAtoms.tsx
// Recoil state also used in Community/Sidebar/PersonalHome.tsx

// Uses MenuListItem.tsx and communityState to display joined communities

import React from 'react';
import CreateCommunityModal from '../../Modal/Community/CreateCommunityModal';
import { Box, Flex, Icon, MenuItem, Text } from '@chakra-ui/react';
import { GrAdd } from 'react-icons/gr'
import { useRecoilState, useRecoilValue } from 'recoil';
import { communityState } from '@/src/atoms/communityAtoms';
import { FaReddit } from 'react-icons/fa';
import MenuListItem from './MenuListItem';
import { communityModalState } from '@/src/atoms/modalAtoms';

const Communities:React.FC = () => {
    const [communityModalStateOpen, setCommunityModalStateOpen] = useRecoilState(communityModalState);
    const mySnippets = useRecoilValue(communityState).mySnippets;
    
    return (

        // Continues on from a MenuList from Directory.tsx
        <>
        
            {/* Create communities modal (not open yet) */}
            <CreateCommunityModal open={communityModalStateOpen} handleClose={() => setCommunityModalStateOpen(false)}/>

            {/* Moderating text */}
            <Box mt='2' mb='3'>
                <Text pl='3' mb='1' fontSize='7pt' fontWeight='500' color='gray.500'>
                    MODERATING
                </Text>
            </Box>

            {/* Moderating community items */}
            { mySnippets.filter(snippet => snippet.isModerator).map(snippet => (

                <MenuListItem
                    key={snippet.communityId}
                    displayText={`r/${snippet.communityId}`}
                    link={`/r/${snippet.communityId}`}
                    icon={FaReddit}
                    iconColor='brand.100'
                    imageURL={snippet.imageURL}
                />

            ))}

            {/* Title text */}
            <Box mt='3' mb='3'>
                <Text pl='3' mb='1' fontSize='7pt' fontWeight='500' color='gray.500'>
                    MY COMMUNITIES
                </Text>
            </Box>

            {/* Create community item */}
            <MenuItem width='100%' fontSize='10pt' _hover={{ bg: 'gray.100' }} onClick={() => {setCommunityModalStateOpen(true)}}>
                <Flex align='center'>
                    <Icon fontSize='20' mr='2' as={GrAdd}/>
                    Create Community
                </Flex>
            </MenuItem>

            {/* Joined community items */}
            { mySnippets.filter(snippet => !snippet.isModerator).map(snippet => (

                <MenuListItem
                    key={snippet.communityId}
                    displayText={`r/${snippet.communityId}`}
                    link={`/r/${snippet.communityId}`}
                    icon={FaReddit}
                    iconColor='blue.500'
                    imageURL={snippet.imageURL}
                />

            ))}
        </>
    )
}
export default Communities;
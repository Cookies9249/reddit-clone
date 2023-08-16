// Component displaying reddit posting rules
// Used in app/submit page

import { Divider, Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { FaReddit } from 'react-icons/fa';

const PostingToReddit:React.FC = () => {

    const rules = ['1. Remember the human',
                   '2. Behave like you would in real life',
                   '3. Look for the original source of content',
                   '4. Search for duplicates before posting',
                   "5. Read the community's rules"]
    
    return (
        <Flex direction='column' bg='white' borderRadius='4px' p='12px'>
                
            {/* Title text */}
            <Flex align='center' p='4px 0px 8px 0px'>
                <Icon as={FaReddit} fontSize='32' color='brand.500' mr='2'/>
                <Text fontSize='11pt' fontWeight='600' mt='1'>Posting to Reddit</Text>
            </Flex>

            <Divider/>

            {/* Rules list */}
            <Flex position='relative' align='center' direction='column' fontSize='10pt'>

                {rules.map((item) => (
                    <>
                    <Flex key={item} width='100%' p='9px 6px'>
                        <Text fontSize='9.5pt' fontWeight='600'>{item}</Text>
                    </Flex>
                    <Divider/>
                    </>
                ))}
                
            </Flex>
        </Flex>
    )
}
export default PostingToReddit;
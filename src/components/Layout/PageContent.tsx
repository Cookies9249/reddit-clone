import { Flex } from '@chakra-ui/react';
import React from 'react';

const PageContent:React.FC = ({ children }) => {
    
    return (
        <Flex justify='center' padding='16px 0px'>
            <Flex justify='center' width='95%' maxWidth='860px'>
                {/* Left Side */}
                <Flex direction='column' width={{ base: '100%', md: '65%' }} mr={{ base: 0, md: 6 }}>{ children && children[0 as keyof typeof children] }</Flex>

                {/* Right Side */}
                <Flex direction='column' display={{ base: 'none', md: 'flex' }} flexGrow='1'>{ children && children[1 as keyof typeof children] }</Flex>
            </Flex>
        </Flex>
    )
}
export default PageContent;
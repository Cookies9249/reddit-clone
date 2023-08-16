// Decorative icons in navbar
// Used in RightContent.tsx

import { Flex, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { BsArrowUpRightCircle, BsChatDots } from 'react-icons/bs';
import { GrAdd } from 'react-icons/gr';
import { IoFilterCircleOutline, IoNotificationsOutline, IoVideocamOutline } from 'react-icons/io5';

const Icons:React.FC = () => {
    const router = useRouter();
    
    return (
        <Flex>
            {/* Icons Medium Screens */}
            <Flex display={{ base: 'none', md: 'flex' }} align='center' borderRight='1px solid' borderColor='gray.200'>

                {/* Popular Icon */}
                <Flex mr='1.5' ml='1.4' padding='1' cursor='pointer' borderRadius='4' _hover={{ bg: 'gray.200' }} onClick={() => router.push('/r/popular')}>
                    <Icon as={BsArrowUpRightCircle} fontSize='20'/>
                </Flex>

                {/* Filter Icon */}
                <Flex mr='1.5' ml='1.4' padding='1' cursor='pointer' borderRadius='4' _hover={{ bg: 'gray.200' }}>
                    <Icon as={IoFilterCircleOutline} fontSize='22'/>
                </Flex>

                {/* Video Icon */}
                <Flex mr='1.5' ml='1.4' padding='1' cursor='pointer' borderRadius='4' _hover={{ bg: 'gray.200' }}>
                    <Icon as={IoVideocamOutline} fontSize='22'/>
                </Flex>

            </Flex>

            {/* Icons All Screens */}
            <>
            {/* Chat Icon */}
            <Flex mr='1.5' ml='1.5' padding='1' cursor='pointer' borderRadius='4' _hover={{ bg: 'gray.200' }}>
                <Icon as={BsChatDots} fontSize='20'/>
            </Flex>

            {/* Notification Icon */}
            <Flex mr='1.5' ml='1.4' padding='1' cursor='pointer' borderRadius='4' _hover={{ bg: 'gray.200' }}>
                <Icon as={IoNotificationsOutline} fontSize='20'/>
            </Flex>

            {/* New Post Icon */}
            <Flex mr='1.5' ml='1.4' padding='1' cursor='pointer' borderRadius='4' _hover={{ bg: 'gray.200' }} display={{ base: 'none', md: 'flex' }}>
                <Icon as={GrAdd} fontSize='20'/>
            </Flex>
            </>
        </Flex>
    )
}
export default Icons;
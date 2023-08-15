import { DirectoryMenuItem } from '@/src/atoms/directoryMenuAtom';
import useDirectory from '@/src/hooks/useDirectory';
import { Button, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { GiCheckedShield } from 'react-icons/gi';

const Premium:React.FC = () => {

    const router = useRouter();
    const { onSelectMenuItem } = useDirectory();

    const premiumMenuItem: DirectoryMenuItem = {
        displayText: 'Premium',
        link: '/premium',
        icon: GiCheckedShield,
        iconColor: 'black',
    }
    
    return (
        <Flex direction='column' bg='white' borderRadius='4'
            cursor='pointer' p='12px'
            border='1px solid' borderColor='gray.300'
        >
            <Flex mb='2'>
                <Icon as={GiCheckedShield} fontSize='26' color='brand.100' mt='1'/>
                <Stack spacing='0.6' fontSize='9pt' pl='3' mb='0.5'>
                    <Text fontWeight='600'>Reddit Premium</Text>
                    <Text>The best Reddit experience</Text>
                </Stack>
            </Flex>
            <Button height='30px' bg='brand.100' onClick={() => onSelectMenuItem(premiumMenuItem)}>
                Try Now
            </Button>
        </Flex>
    )
}
export default Premium;
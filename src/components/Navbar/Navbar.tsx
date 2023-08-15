import { Flex, Image } from '@chakra-ui/react';
import React from 'react';
import SearchInput from './SearchInput';
import RightContent from './RightContent/RightContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/src/firebase/clientApp';
import Directory from './Directory/Directory';
import useDirectory from '@/src/hooks/useDirectory';
import { defaultMenuItem } from '@/src/atoms/directoryMenuAtom';

const Navbar: React.FC = () => {
    // Auth state to toggle content
    const [user] = useAuthState(auth)
    const { onSelectMenuItem } = useDirectory();

    return (
        <Flex bg='white' height='44px' padding='6px 12px' justify={{ md: 'space-between' }} position='sticky' top='0px'>

            {/* Reddit Logos */}
            <Flex align='center' cursor='pointer'
                width={{ base: '40px', md: 'auto' }} mr={{ base: 0, md: 2 }}
                onClick={() => onSelectMenuItem(defaultMenuItem)}
            >
                <Image src='/images/redditFace.svg' height='30px'/>
                <Image src='/images/redditText.svg' height='46px' display={{ base: 'none', md: 'unset' }}/>
            </Flex>
            {/* 'display' gives media query. For 'base' (mobile), do not display. For 'md' (medium), display. */}

            {/* Directories */}
            {user && <Directory/>}

            {/* Search Bar */}
            <SearchInput user={user}/>

            {/* Other Inputs */}
            <RightContent user={user}/>

        </Flex>
    )
}
export default Navbar;
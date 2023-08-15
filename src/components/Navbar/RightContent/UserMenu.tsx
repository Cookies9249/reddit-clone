// Template from https://chakra-ui.com/docs/components/menu#usage

import { Menu, MenuButton, Text, MenuList, MenuItem, Icon, Flex, MenuDivider } from '@chakra-ui/react';
import React from 'react';
import { User, signOut } from 'firebase/auth';
import { auth } from '@/src/firebase/clientApp';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { authModalState } from '@/src/atoms/authModalAtom';

// Icon imports
import { FaRedditSquare } from 'react-icons/fa';
import { VscAccount } from 'react-icons/vsc';
import { IoSparkles } from 'react-icons/io5';
import { CgProfile } from 'react-icons/cg';
import { MdOutlineLogin } from 'react-icons/md';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { communityState } from '@/src/atoms/communityAtoms';

type UserMenuProps = {
    user?: User | null;
};

const UserMenu:React.FC<UserMenuProps> = ({ user }) => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const resetCommunityState = useResetRecoilState(communityState);

    const logout = async () => {
        
        await signOut(auth);
        // migrated to useCommunityData in useEffect: resetCommunityState()
    }
    
    return (
        // Dropdown menu for user options
        <Menu>
            <MenuButton cursor='pointer' padding='0px 6px' borderRadius='4' _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}>

                {/* Menu styling */}
                <Flex align='center'>
                    <Flex align='center'>
                        {user ? (
                            // If a user is logged in
                            <>
                                {/* Reddit icon */}
                                <Icon fontSize='24' mr='1' color='gray.300' as={FaRedditSquare}/>

                                {/* Text Display */}
                                <Flex direction='column' display={{ base: 'none', lg: 'flex'}} fontSize='8pt' align='flex-start' mr='8'>
                                    {/* Name */}
                                    <Text fontWeight='700'>
                                        {user?.displayName || user.email?.split('@')[0] }
                                    </Text>

                                    {/* Karma */}
                                    <Flex>
                                        <Icon as={IoSparkles} color='brand.100' mr='1'/>
                                        <Text color='gray.400'>1 karma</Text>
                                    </Flex>
                                </Flex>
                            </>
                        ) : (
                            // If no user is logged in
                            <Icon fontSize='24' color='gray.400' mr='1' as={VscAccount}/>
                        )}
                    </Flex>
                    <ChevronDownIcon/>
                </Flex>

            </MenuButton>

            {/* Menu Items */}
            <MenuList>
                { user ? (

                    // If a user is logged in
                    <>
                        {/* Profile */}
                        <MenuItem
                            fontSize='10pt'
                            fontWeight='700'
                            _hover={{ bg: 'blue.500', color: 'white' }}
                        >
                            <Flex align='center'>
                                <Icon fontSize='20' mr='2' as={CgProfile}/>
                                Profile
                            </Flex>
                        </MenuItem>

                        <MenuDivider/>

                        {/* Log Out */}
                        <MenuItem
                            fontSize='10pt'
                            fontWeight='700'
                            _hover={{ bg: 'blue.500', color: 'white' }}
                            onClick={logout}
                        >
                            <Flex align='center'>
                                <Icon fontSize='20' mr='2' as={MdOutlineLogin}/>
                                Log Out
                            </Flex>
                        </MenuItem>
                    </>

                ) : (

                    // If no user is logged in
                    <>
                        {/* Log In / Sign Up */}
                        <MenuItem
                            fontSize='10pt'
                            fontWeight='700'
                            _hover={{ bg: 'blue.500', color: 'white' }}
                            onClick={() => setAuthModalState( {open: true, view: 'login'} )}
                        >
                            <Flex align='center'>
                                <Icon fontSize='20' mr='2' as={MdOutlineLogin}/>
                                Log In / Sign Up
                            </Flex>
                        </MenuItem>
                    </>

                )}

            </MenuList>
        </Menu>
    )
}
export default UserMenu;
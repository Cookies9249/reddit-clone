// Template from https://chakra-ui.com/docs/components/menu#usage

// Directory for accessing communities
// Used in Navbar.tsx
// Uses Communities.tsx for directory items

import { Menu, MenuButton, Text, MenuList, MenuItem, Icon, Image, Flex } from '@chakra-ui/react';
import React from 'react';

// Icon imports
import { ChevronDownIcon } from '@chakra-ui/icons';
import Communities from './Communities';
import useDirectory from '@/src/hooks/useDirectory';

const Directory:React.FC = () => {    
    const { directoryState, toggleMenuOpen } = useDirectory();

    return (
        // Dropdown menu for user options
        <Menu isOpen={directoryState.open}>
            <MenuButton cursor='pointer' padding='0px 6px' borderRadius='4' mr='2' ml='2'
                _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
                onClick={toggleMenuOpen}
            >
                {/* Menu styling */}
                <Flex align='center' justify='space-between' width={{ base: 'auto', lg: '200px' }}>
                    <Flex align='center'>

                        {/* Directory Icon */}
                        {directoryState.selectedMenuItem.imageURL ? (
                            <Image src={directoryState.selectedMenuItem.imageURL}
                                borderRadius='full' boxSize='24px' mr='2'    
                            />
                        ) : (
                            <Icon fontSize='24' mr={{ base: 1, md: 2 }}
                                as={directoryState.selectedMenuItem.icon}
                                color={directoryState.selectedMenuItem.iconColor}
                            />
                        )}

                        {/* Directory Text */}
                        <Flex display={{ base: 'none', lg: 'flex' }}>
                            <Text fontSize='10pt' fontWeight='600'>
                                {directoryState.selectedMenuItem.displayText}
                            </Text>
                        </Flex>

                    </Flex>
                    <ChevronDownIcon/>
                </Flex>
            </MenuButton>

            {/* Menu Items */}
            <MenuList>
                <Communities/>
            </MenuList>
        </Menu>
    )
}
export default Directory;
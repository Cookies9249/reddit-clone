// Template for directory menu items
// Used in Communities.tsx

import useDirectory from '@/src/hooks/useDirectory';
import { MenuItem, Flex, Icon, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { IconType } from 'react-icons/lib';

type MenuListItemProps = {
    displayText: string;
    link: string;
    icon: IconType;
    iconColor: string;
    imageURL?: string;
};

const MenuListItem:React.FC<MenuListItemProps> = ({ displayText, link, icon, iconColor, imageURL }) => {
    const { onSelectMenuItem } = useDirectory();
    
    return (
        <MenuItem width='100%' fontSize='10pt' _hover={{ bg: 'gray.100' }} onClick={() => onSelectMenuItem({displayText, link, icon, iconColor, imageURL})}>
            <Flex align='center'>

                {/* Community icon or default icon */}
                {imageURL ? (
                    <Image src={imageURL} borderRadius='full' boxSize='18px'/>
                ) : (
                    <Icon as={icon} fontSize='20px' color={iconColor}/>
                )}

                <Text ml='2'>{displayText}</Text>
                
            </Flex>
        </MenuItem>
    )
}
export default MenuListItem;
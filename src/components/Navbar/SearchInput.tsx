// Template from https://chakra-ui.com/docs/components/input
// Icon from https://chakra-ui.com/docs/components/icon

import { SearchIcon } from '@chakra-ui/icons';
import { Flex, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React from 'react';

type SearchInputProps = {
    user?: User | null;
};

const SearchInput:React.FC<SearchInputProps> = ({ user }) => {
    return (
        // Search Bar
        // flexGrow={1}: use all room in container
        <Flex flexGrow='1' mr='2' maxWidth={user ? 'auto' : '600px'} align='center'>
            <InputGroup>
                <InputLeftElement pointerEvents='none'>
                <SearchIcon color='gray.300' mb='1'/>
                </InputLeftElement>
                <Input
                    placeholder='Search Reddit' fontSize='10pt'
                    _placeholder={{ color: 'gray:500' }}
                    _hover={{ 
                        bg: 'white',
                        border: '1px solid',
                        borderColor: 'blue.500'
                    }}
                    _focus={{
                        outline: 'none',
                        border: '1px solid',
                        borderColor: 'blue.500'
                    }}
                    height='34px'
                    bg='gray.50'
                />
            </InputGroup>
        </Flex>
    )
}
export default SearchInput;
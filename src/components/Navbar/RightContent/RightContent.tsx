// tfcd
import { Button, Flex } from '@chakra-ui/react';
import React from 'react';
import AuthButtons from './AuthButtons';
// For components on right side of navbar
// Used in Navbar.tsx
// Uses Icons, AuthButtons, AuthModal, UserMenu

import AuthModal from '../../Modal/Auth/AuthModal';
import { User } from 'firebase/auth';
import Icons from './Icons';
import UserMenu from './UserMenu';

type RightContentProps = {
    user?: User | null;
};

const RightContent:React.FC<RightContentProps> = ({ user }) => {
    return (
        <>
        {/* Modals */}
        <AuthModal/>

        {/* Buttons */}
        <Flex justify='center' align='center'>
            {user ? <Icons/> : <AuthButtons/>}
            
            <UserMenu user={user}/>
        </Flex>
        </>
    )
}
export default RightContent;
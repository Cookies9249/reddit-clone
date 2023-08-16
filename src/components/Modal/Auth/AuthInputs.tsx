// Displays either sign up or login components in modal
// Used in AuthModal.tsx
// Uses components from SignUp.tsx and LogIn.tsx 

import { authModalState } from '@/src/atoms/modalAtoms';
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useRecoilValue } from 'recoil';
import SignUp from './SignUp';
import LogIn from './LogIn';

const AuthInputs:React.FC = () => {
    const modalState = useRecoilValue(authModalState)
    
    return (
        <Flex direction='column' align='center' justify='center' width='100%' mt='4'>
            {modalState.view === 'login' && <LogIn/>}
            {modalState.view === 'signup' && <SignUp/>}
        </Flex>
    )
}
export default AuthInputs;
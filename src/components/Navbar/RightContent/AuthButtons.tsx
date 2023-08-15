import { authModalState } from '@/src/atoms/modalAtoms';
import { Button } from '@chakra-ui/react';
import React from 'react';
import { useSetRecoilState } from 'recoil';

const AuthButtons:React.FC = () => {
    const setAuthModalState = useSetRecoilState(authModalState)

    return (
        <>
        {/* Variants found in chakra/button.ts */}
        <Button
            variant='outline'
            height='28px'
            display={{ base: 'none', sm: 'flex' }}
            width={{ base:'70px', md:'100px' }}
            mr='2'
            onClick={() => setAuthModalState( {open: true, view: 'login'} )}
        >
            Log In
        </Button>
        <Button
            variant='solid'
            height='28px'
            display={{ base: 'none', sm: 'flex' }}
            width={{ base:'70px', md:'100px' }}
            mr='2'
            onClick={() => setAuthModalState( {open: true, view: 'signup'} )}
        >
            Sign Up
        </Button>
        </>
    )
}
export default AuthButtons;
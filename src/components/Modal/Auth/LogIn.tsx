import { authModalState } from '@/src/atoms/modalAtoms';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '@/src/firebase/clientApp'
import { FIREBASE_ERRORS } from '@/src/firebase/errors'

const LogIn:React.FC = () => {
    // Get global state for modal state
    const setAuthModalState = useSetRecoilState(authModalState)

    // Create a local state for inputs
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    })

    // Sign in using react-firebase-hooks
    const [ signInWithEmailAndPassword, user, loading, error ] = useSignInWithEmailAndPassword(auth);
    
    // Firebase logic
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // If Passwords match
        signInWithEmailAndPassword(loginForm.email, loginForm.password)
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Update form state
        setLoginForm(prev => ({
            // Spread the previous state value
            ...prev, 
            // Get the event input
            [event.target.name]: event.target.value,
        }))
    }
    
    return (
        <form onSubmit={onSubmit}>

            {/* Text Inputs (Username and Password) */}
            <Input required
                name='email' placeholder='Email' type='email'
                fontSize='10pt' mb='2' bg='gray.50'
                onChange={onChange}
                _placeholder={{ color: 'gray.500' }}
                _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
                _focus={{ outline: 'none', bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
            />
            <Input required
                name='password' placeholder='Password' type='password'
                fontSize='10pt' mb='2' bg='gray.50'
                onChange={onChange}
                _placeholder={{ color: 'gray.500' }}
                _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
                _focus={{ outline: 'none', bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
            />

            {/* Error Text */}
            <Text textAlign='center' color='red' fontSize='10pt'>
                { FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS] }
            </Text>

            {/* Submit Button */}
            <Button width='100%' height='36px' mt='2' mb='2' type='submit'>
                Log In
            </Button>

            {/* Change to Reset Password */}
            <Flex fontSize='9pt' justifyContent='center' mb='2'>
                <Text mr='1'>Forgot your password?</Text>
                <Text color='blue.500' fontWeight='700' cursor='pointer' onClick={() => setAuthModalState(
                    prev => ({
                        ...prev,
                        view: 'resetPassword'
                    })
                )}>Reset</Text>
            </Flex>

            {/* Change to Sign Up */}
            <Flex fontSize='9pt' justifyContent='center'>
                <Text mr='1'>New here?</Text>
                <Text color='blue.500' fontWeight='700' cursor='pointer' onClick={() => setAuthModalState(
                    prev => ({
                        ...prev,
                        view: 'signup'
                    })
                )}>Sign Up</Text>
                {/* cursor='pointer' adds click visuals */}
            </Flex>
        </form>
    )
}
export default LogIn;
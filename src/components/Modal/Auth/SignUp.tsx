import { authModalState } from '@/src/atoms/modalAtoms';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth, firestore } from '@/src/firebase/clientApp'
import { FIREBASE_ERRORS } from '@/src/firebase/errors'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

const SignUp:React.FC = () => {
    // Get global state for modal state
    const setAuthModalState = useSetRecoilState(authModalState)

    // Create a local state for inputs
    const [signUpForm, setSignUpForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })

    // Create a local state for errors
    const [matchError, setError] = useState('')
    
    // Create a user using react-firebase-hooks
    const [
        createUserWithEmailAndPassword,
        userCred,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);

    // Firebase logic
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (matchError) setError('');
        if (signUpForm.password !== signUpForm.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // If Passwords match
        createUserWithEmailAndPassword(signUpForm.email, signUpForm.password)
    }
    
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Update form state
        setSignUpForm(prev => ({
            // Spread the previous state value
            ...prev, 
            // Get the event input
            [event.target.name]: event.target.value,
        }))
    }

    // Create user document in FireStore
    const createUserDocument = async (user: User) => {
        const userDocRef = doc(firestore, 'users', user.uid);

        await setDoc(
            userDocRef,
            JSON.parse(JSON.stringify(user))
        );
    };

    useEffect(() => {
        if (userCred) {
            createUserDocument(userCred.user);
        }
    }, [userCred])
    
    return (
        <form onSubmit={onSubmit}>
            
            {/* Text Inputs (Username and Password) */}
            <Input
                required
                name='email'
                placeholder='Email'
                type='email'
                mb='2'
                onChange={onChange}
                fontSize='10pt'
                _placeholder={{ color: 'gray.500' }}
                _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
                _focus={{ outline: 'none', bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
                bg='gray.50'
            />
            <Input
                required
                name='password'
                placeholder='Password'
                type='password'
                mb='2'
                onChange={onChange}
                fontSize='10pt'
                _placeholder={{ color: 'gray.500' }}
                _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
                _focus={{ outline: 'none', bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
                bg='gray.50'
            />
            <Input
                required
                name='confirmPassword'
                placeholder='Confirm Password'
                type='password'
                mb='2'
                onChange={onChange}
                fontSize='10pt'
                _placeholder={{ color: 'gray.500' }}
                _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
                _focus={{ outline: 'none', bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
                bg='gray.50'
            />

            {/* Error Text */}
            <Text textAlign='center' color='red' fontSize='10pt'>
                { matchError || FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS] }
            </Text>

            {/* Submit Button */}
            <Button width='100%' height='36px' mt='2' mb='2' type='submit' isLoading={loading}>
                Sign Up
            </Button>

            {/* Change Modal */}
            <Flex fontSize='9pt' justifyContent='center'>
                <Text mr='1'>Already a redditor?</Text>
                <Text color='blue.500' fontWeight='700' cursor='pointer' onClick={() => setAuthModalState(
                    prev => ({
                        ...prev,
                        view: 'login'
                    })
                )}>Log In</Text>
            </Flex>
        </form>
    )
}
export default SignUp;
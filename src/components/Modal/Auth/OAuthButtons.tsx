import { Flex, Button, Image, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth, firestore } from '@/src/firebase/clientApp'
import { User } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

const OAuthButtons:React.FC = () => {
    // Sign in user with Google using firebase
    const [signInWithGoogle, userCred, loading, error] = useSignInWithGoogle(auth);

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
        // Other Log In / Sign Up methods
        <Flex direction='column' width='100%' mb='4'>
            {/* Google Sign In */}
            <Button variant='oauth' mb='2' isLoading={loading} onClick={() => signInWithGoogle()}>
                <Image src='images/googlelogo.png' height='20px' mr='4'/>
                Continue with Google
            </Button>

            {/* Other Method Sign In */}
            <Button variant='oauth'>
                Some Other Provider
            </Button>

            {/* Error Text */}
            <Text textAlign='center' color='red' fontSize='10pt'>
                { error?.message }
            </Text>
        </Flex>
    )
}
export default OAuthButtons;
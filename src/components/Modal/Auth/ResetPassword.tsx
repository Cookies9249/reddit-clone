// Modal view for resetting password using useSendPasswordResetEmail() hook
// Used in AuthModal.tsx
// Updates AuthModal using authModalState

import { authModalState } from '@/src/atoms/modalAtoms';
import { auth } from '@/src/firebase/clientApp';
import { Flex, Button, Image, Text, Input, Icon, Link } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { useSetRecoilState } from 'recoil';
import { BsDot, BsReddit } from "react-icons/bs";

const ResetPassword: React.FC = () => {
  // Get global state for modal state
  const setAuthModalState = useSetRecoilState(authModalState)

  // Create a local state for inputs
  const [email, setEmail] = useState("")
  const [success, setSuccess] = useState(false)

  // Set up using Firebase
  const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(auth);

  // Set form values
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Update form state
    setEmail(event.target.value)
  }

  // On submit, send email and wait for response (async)
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    await sendPasswordResetEmail(email)
    setSuccess(true)
  }

  return (
    <Flex direction='column' width='100%' mb='4' alignItems="center">
      {/* Reddit Image */}
      {/* <Image src='images/redditFace.svg' height='40px' mb='2' /> */}
      <Icon as={BsReddit} color="brand.100" fontSize='40' mb='2' />

      {/* Text Content */}
      <Text textAlign='center' fontWeight='700' fontSize='10pt' mb='2'>
        Reset your password
      </Text>

      {/* Text (Dependent on Success) */}
      {success ? (
          <Text mb='4'>Check your email</Text>
      ) : (
        <>
        <Text textAlign='center' fontSize='sm' mb='2'>
          {`Enter the email associated with your account and we'll send you a reset link`}
        </Text>

        <form onSubmit={onSubmit}>

          {/* Text Input */}
          <Input required name='email' placeholder='Email' type='email'
            mb='2' fontSize='10pt' bg='gray.50'
            onChange={onChange}
            _placeholder={{ color: 'gray.500' }}
            _hover={{ bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
            _focus={{ outline: 'none', bg: 'white', border: '1px solid', borderColor: 'blue.500' }}
          />

          {/* Error Text */}
          <Text textAlign='center' color='red' fontSize='10pt'>
            {error?.message}
          </Text>

          {/* Submit Button */}
          <Button width='100%' height='36px' mt='2' mb='2' type='submit' isLoading={sending}>
            Reset Password
          </Button>
          
        </form>
        </>
      )}

      {/* Change Modals */}
      <Flex alignItems='center' fontSize='9pt' color='blue.500' fontWeight='700' cursor='pointer'>

        {/* Change to Log In */}
        <Text onClick={() => setAuthModalState((prev) => ({...prev, view: "login"}))}>
          Log In
        </Text>

        {/* Dot (Formatting) */}
        <Icon as={BsDot} />

        {/* Change to Sign Up */}
        <Text onClick={() => setAuthModalState((prev) => ({...prev, view: "signup"}))}>
          Sign Up
        </Text>

      </Flex>
    </Flex>
  )
}
export default ResetPassword;
// Template from https://v1.chakra-ui.com/docs/components/overlay/modal

// Component for authentication modal
// Open/Closing logic uses authModalState from atoms/modalAtoms.tsx
// Uses AuthInputs and OAuthButtons
// Used in Navbar/RightContent/RightContent.tsx
// Recoil state used in ...

import { authModalState } from '@/src/atoms/modalAtoms';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import AuthInputs from './AuthInputs';
import OAuthButtons from './OAuthButtons';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/src/firebase/clientApp';
import ResetPassword from './ResetPassword';

const AuthModal:React.FC = () => {
  // modalState = default (open and view)  
  const [modalState, setModalState] = useRecoilState(authModalState)

  // Auth state to toggle model
  const [user] = useAuthState(auth)

  // Close modal (called with exit button)
  const handleClose = () => {
    setModalState((prev) => ({
        ...prev,
        open: false,
    }))
  }

  // Close modal with successful sign in (Runs when `user` changes)
  useEffect(() => {
    if (user) handleClose();
    console.log('user', user)
  }, [user])
  
  return (
    <>
    {/* modalState controls the state of modal */}
      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign='center'>

            {/* if modalState.view == 'login', display 'Login' */}
            {modalState.view === 'login' && 'Log In'}
            {modalState.view === 'signup' && 'Sign Up'}
            {modalState.view === 'resetPassword' && 'Reset Password'}

          </ModalHeader>
          <ModalCloseButton/>
          <ModalBody display='flex' flexDirection='column' alignItems='center' justifyContent='center' pb='6'>
            <Flex direction='column' align='center' justify='center' width='70%'>

              {/* Content in Modals */}
              {(modalState.view === 'login' || modalState.view === 'signup') ? (
                <>
                <OAuthButtons/>
                <Text color='gray.500' fontWeight='700'>OR</Text>
                <AuthInputs/>
                </>
              ) : <ResetPassword/>}

            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default AuthModal;
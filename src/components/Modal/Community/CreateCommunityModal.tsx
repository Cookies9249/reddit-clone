import { Box, Button, Checkbox, Divider, Flex, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { HiLockClosed } from 'react-icons/hi'
import { BsFillEyeFill, BsFillPersonFill } from 'react-icons/bs'
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, firestore } from '@/src/firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import useDirectory from '@/src/hooks/useDirectory';

type CreateCommunityModalProps = {
    open: boolean;
    handleClose: () => void;
};

const CreateCommunityModal:React.FC<CreateCommunityModalProps> = ({ open, handleClose }) => {
  // Local state for community name
  const [communityName, setCommunityName] = useState('');
  const [communityType, setCommunityType] = useState('public');
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [error, setError] = useState('');
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const { directoryState, toggleMenuOpen } = useDirectory();
  const router = useRouter();

  // Called on change of input box
  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;
    setCommunityName(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  }

  // Called on change of checkboxes
  const onTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommunityType(event.target.name)
  }

  const handleCreateCommunity = async () => {
    
    // Validate the community (No special chars, correct length)
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(communityName)) {
      setError('Community names can only contain letters, numbers, and underscores');
      return;
    }
    else if (communityName.length < 3) {
      setError('Community names must be between 3-21 characters')
      return;
    }
    setLoading(true);

    try {
      // Check that name is not taken
      const communityDocRef = doc(firestore, 'communities', communityName); // ref to doc in FireStore database

      // transactions are between documents
      await runTransaction(firestore, async (transaction) => {
        const communityDoc = await transaction.get(communityDocRef); // get FireStore doc
        if (communityDoc.exists()) {
          throw new Error(`Sorry, r/${communityName} is taken. Try another.`);
        }

        // Create community, document in FireStore
        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        });

        // Create community snippet on user
        // const snippetDocRef = 
        transaction.set(
          doc(firestore, `users/${user?.uid}/communitySnippets`, communityName), 
          { communityId: communityName, isModerator: true }
        );

        // transaction: if one part fails, all parts fail
      });

      // Route to new community and close modal and directory
      router.push(`/r/${communityName}`);
      handleClose();
      if (directoryState.open) {
        toggleMenuOpen();
      }

    } catch (error: any) {
      console.log('handleCreateCommunity error');
      setError(error.message);
    }
    
    setLoading(false);
  }

  return (
    <>    
      <Modal isOpen={open} onClose={handleClose} size='lg'>
          <ModalOverlay />
          <ModalContent>
            {/* Header */}
            <ModalHeader display='flex' flexDirection='column' fontSize='15' padding='3'>
              Create a community
            </ModalHeader>

            {/* Body */}
            <Box pl='3' pr='3'>

              {/* Text Display */}
              <Divider/>
              <ModalCloseButton/>
              <ModalBody display='flex' flexDirection='column' padding='10px 0px'>
                      
                <Text fontWeight='600' fontSize='15'>
                  Name
                </Text>

                <Text fontSize='11' color='gray.500'>
                  Community names including capitalization cannot be changed
                </Text>

                <Text position='relative' top='28px' left='10px' width='20px' color='gray.400'>
                  r/
                </Text>

                {/* Community Name Input */}
                <Input position='relative' value={communityName} size='sm' pl='22px' onChange={onNameChange}/>

                <Text fontSize='9pt' color={ charsRemaining === 0 ? 'red' : 'gray.500' }>
                  {charsRemaining} Characters remaining
                </Text>

                {/* Error validation */}
                <Text fontSize='9pt' color='red' pt='1'>
                  {error}
                </Text>

                {/* Selectors */}
                <Box mt='4' mb='4'>
                  <Text fontWeight='600' fontSize='15'>
                    Community Type
                  </Text>

                  {/* Checkboxes */}
                  <Stack spacing='2' onChange={onTypeChange}>

                    {/* Public community */}
                    <Checkbox name='public' isChecked={communityType === 'public'}>
                      <Flex align='center'>
                        <Icon color='gray.500' mr='2' as={BsFillEyeFill}/>
                        <Text fontSize='10pt' mr='1'>
                          Public
                        </Text>
                        <Text fontSize='8pt' color='gray.500' pt='0.5'>
                          Anyone can view, post, and comment to this community
                        </Text>
                      </Flex>
                    </Checkbox>

                    {/* Restricted community */}
                    <Checkbox name='restricted' isChecked={communityType === 'restricted'}>
                      <Flex align='center'>
                        <Icon color='gray.500' mr='2' as={BsFillPersonFill}/>
                        <Text fontSize='10pt' mr='1'>
                          Restricted
                        </Text>
                        <Text fontSize='8pt' color='gray.500' pt='0.5'>
                          Anyone can view this community, but only approved users can post
                        </Text>
                      </Flex>
                    </Checkbox>

                    {/* Private community */}
                    <Checkbox name='private' isChecked={communityType === 'private'}>
                      <Flex align='center'>
                        <Icon color='gray.500' mr='2' as={HiLockClosed}/>
                        <Text fontSize='10pt' mr='1'>
                          Private
                        </Text>
                        <Text fontSize='8pt' color='gray.500' pt='0.5'>
                          Only approved users can view and submit to this community
                        </Text>
                      </Flex>
                    </Checkbox>

                  </Stack>
                  {/* Stack = Flex that auto handles spacing */}

                </Box>

              </ModalBody>

            </Box>
    
                  {/* Buttons */}
                  <ModalFooter bg='gray.100' borderRadius='0px 0px 10px 10px'>
                    <Button variant='outline' height='30px' mr='3' onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button height='30px' onClick={handleCreateCommunity} isLoading={loading}>
                      Create Community
                    </Button>
                  </ModalFooter>
                </ModalContent>
            </Modal>
        </>
      )
}
export default CreateCommunityModal;
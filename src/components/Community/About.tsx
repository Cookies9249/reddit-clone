import { Community, communityState } from '@/src/atoms/communityAtoms';
import { Box, Button, Divider, Flex, Icon, Image, Spinner, Stack, Text } from '@chakra-ui/react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { RiCakeLine } from 'react-icons/ri'
import React, { useRef, useState } from 'react';
import moment from 'moment';
import Link from 'next/link';
import useSelectFile from '@/src/hooks/useSelectFile';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore, storage } from '@/src/firebase/clientApp';
import { FaReddit } from 'react-icons/fa';
import { AnyARecord } from 'dns';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useSetRecoilState } from 'recoil';

type AboutProps = {
    communityData: Community;
};

const About:React.FC<AboutProps> = ({ communityData }) => {

    // User and select file hooks
    const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
    const [user] = useAuthState(auth);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Ref for selecting image file
    const selectedFileRef = useRef<HTMLInputElement>(null);

    // Community atoms
    const setCommunityState = useSetRecoilState(communityState);

    // Selecting a new community image
    const onUpdateImage = async () => {
        if (!selectedFile) return;
        setUploadingImage(true);
        
        console.log('FILE', selectedFile);

        try {

            // Upload to storage
            const imageRef = ref(storage, `communities/${communityData.id}/image`);

            await uploadString(imageRef, selectedFile, 'data_url');
            const downloadURL = await getDownloadURL(imageRef);

            // Update community document
            const postDocRef = doc(firestore, 'communities', communityData.id);
            await updateDoc(postDocRef, {
                imageURL: downloadURL,
            })

            // Update recoil state
            setCommunityState(prev => ({
                ...prev,
                currentCommunity: {
                    ...prev.currentCommunity,
                    imageURL: downloadURL,
                } as Community
            }))
            
        } catch (error: any) {
            console.log('onUpdateImage error', error.message);
        }
        setUploadingImage(false);
    };

    return (
        <Box position='sticky' top='14px'>

            {/* Header */}
            <Flex justify='space-between' align='center' bg='blue.400' color='white' p='3' borderRadius='4px 4px 0px 0px'>
                <Text fontSize='10pt' fontWeight='700'>About Community</Text>
                <Icon as={HiOutlineDotsHorizontal}/>
            </Flex>

            {/* Body */}
            <Flex direction='column' p='3' bg='white' borderRadius='0px 0px 4px 4px'>

                <Stack>
                    
                    <Flex width='100%' p='2' fontSize='10pt' fontWeight='700'>

                        {/* Members */}
                        <Flex direction='column' flexGrow='1'>
                            <Text>{communityData.numberOfMembers.toLocaleString()}</Text>
                            <Text>Members</Text>
                        </Flex>

                        {/* Online */}
                        <Flex direction='column' flexGrow='1'>
                            <Text>1</Text>
                            <Text>Online</Text>
                        </Flex>

                    </Flex>

                    <Divider/>

                    <Flex align='center' width='100%' p='1' fontWeight='500' fontSize='10pt'>

                        {/* Creation date */}
                        <Icon as={RiCakeLine} fontSize='18' mr='2'/>
                        { communityData.createdAt && (
                            <Text>
                                Created {moment(new Date(communityData.createdAt?.seconds * 1000)).format('MMM DD, YYYY')}
                            </Text>
                        )}

                    </Flex>

                    {/* Creation date */}
                    <Link href={`/r/${communityData.id}/submit`}>
                        <Button mt='1' height='30px' width='100%'>Create Post</Button>
                    </Link>

                    {/* Only displayed if user is admin */}
                    { user?.uid === communityData.creatorId && (
                        <>
                            <Divider/>
                            
                            <Stack spacing='1' fontSize='10pt'>

                                {/* Admin text */}
                                <Text fontWeight='600'>Admin</Text>

                                {/* Upload new community image */}
                                <Flex justify='space-between' align='center'>

                                    {/* Image input */}
                                    <Text color='blue.500' cursor='pointer'
                                        _hover={{ textDecoration: 'underline' }}
                                        onClick={() => selectedFileRef.current?.click()}
                                    >
                                        Change Image
                                    </Text>

                                    <input id='file-upload' ref={selectedFileRef} type='file' accept='image/x-png, image/gif, image/jpeg' hidden onChange={onSelectFile}/>

                                    {/* Show community image or default */}
                                    { communityData.imageURL ?? selectedFile ? (
                                        <Image src={selectedFile ?? communityData.imageURL} borderRadius='full' boxSize='40px' alt='Community Image'/>
                                    ) : (
                                        <Icon as={FaReddit} fontSize='40' color='brand.100' mr='2'/>
                                    )}

                                </Flex>

                                {/* Save Changes text */}
                                {selectedFile && (
                                    
                                    (uploadingImage ? (
                                        <Spinner/>
                                    ) : (
                                        <Text cursor='pointer' onClick={onUpdateImage}>Save Changes</Text>
                                    ))
                                    
                                )}

                            </Stack>
                        </>
                    )}

                </Stack>
            </Flex>
        </Box>
        
    )
}
export default About;
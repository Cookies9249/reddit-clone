import { Alert, AlertIcon, Flex, Icon, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsLink45Deg } from 'react-icons/bs';
import { BiPoll } from 'react-icons/bi'
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import TabItem from './TabItem';
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';
import { Post } from '@/src/atoms/postsAtom';
import { User } from 'firebase/auth';
import { useParams, useRouter } from 'next/navigation';
import { Timestamp, addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '@/src/firebase/clientApp';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import useSelectFile from '@/src/hooks/useSelectFile';

// CONTAINS: Post creation using Post object, handleChanges, handleCreate, and Image uploading
// Called from submit/page.tsx

type NewPostFormProps = {
    user: User;
    communityImageURL?: string;
};

// Multi tab navigation
const formTabs: TabItemType[] = [
    { title: 'Post', icon: IoDocumentText },
    { title: 'Images', icon: IoImageOutline },
    { title: 'Link', icon: BsLink45Deg },
    { title: 'Poll', icon: BiPoll },
]

// Tab Item
export type TabItemType = {
    title: string,
    icon: typeof Icon.arguments,
}

const NewPostForm:React.FC<NewPostFormProps> = ({ user, communityImageURL }) => {
    // Tab in Navbar
    const [selectedTab, setSelectedTab] = useState(formTabs[0].title);

    // Text inputs
    const [textInputs, setTextInputs] = useState({
        title: '',
        body: '',
    });

    // Image inputs (using custom hook)
    const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const router = useRouter();
    const { communityId } = useParams();

    // Change text inputs
    const onTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { target: { name, value } } = event;
        setTextInputs(prev => ({
            ...prev, 
            [name]: value,
        }))
    };

    const handleCreatePost = async () => {
        setLoading(true);

        // Create new post
        const newPost: Post = {
            communityId: communityId,
            creatorId: user.uid,
            creatorDisplayName: user.email!.split('@')[0],  // '!' forces (guarantees there will be a valid value)
            title: textInputs.title,
            body: textInputs.body,
            numberOfComments: 0,
            voteStatus: 0,
            communityImageURL: communityImageURL || '',
            createdAt: serverTimestamp() as Timestamp,
        };

        try {
            
            // Store the post in firebase
            const postDocRef = await addDoc(collection(firestore, 'posts'), newPost)

            // Store the image in storage
            if (selectedFile) {
                const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
                await uploadString(imageRef, selectedFile, 'data_url');
                const downloadURL = await getDownloadURL(imageRef);

                // Update post imageURL
                await updateDoc(postDocRef, {
                    imageURL: downloadURL,
                })
            }

            // Redirect user back to communtiies
            router.back()

        } catch (error: any) {
            console.log('handleCreatePost error', error)
            setError(true)
        }
        setLoading(false);
    };
    
    return (
        <Flex direction='column' bg='white' borderRadius='4' mt='2'>

            {/* Navbar tabs */}
            <Flex width='100%'>
                { formTabs.map(item => (
                    <TabItem key={item.title} item={item} selected={selectedTab === item.title} setSelectedTab={setSelectedTab}/>
                ))}
            </Flex>

            <Flex p='4'>
                
                {selectedTab === 'Post' && (
                    <TextInputs textInputs={textInputs} handleCreatePost={handleCreatePost} onChange={onTextChange} loading={loading}/>
                )}

                {selectedTab === 'Images' && (
                    <ImageUpload selectedFile={selectedFile} onSelectImage={onSelectFile} setSelectedTab={setSelectedTab} setSelectedFile={setSelectedFile} loading={loading}/>
                )}

            </Flex>

            { error && (
                // Taken from Alert documentation: https://chakra-ui.com/docs/components/alert
                <Alert status='error'>
                    <AlertIcon />
                    <Text mr='2'>Error creating post</Text>
                </Alert>
            ) }
            
        </Flex>
    )
}
export default NewPostForm;
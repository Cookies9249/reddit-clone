import { Button, Flex, Image, Stack } from '@chakra-ui/react';
import React, { useRef } from 'react';

type ImageUploadProps = {
    selectedFile?: string;
    onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setSelectedTab: (value: string) => void;
    setSelectedFile: (value: string) => void;
    loading: boolean
};

const ImageUpload:React.FC<ImageUploadProps> = ({ selectedFile, onSelectImage, setSelectedTab, setSelectedFile, loading }) => {

    const selectedFileRef = useRef<HTMLInputElement>(null);
    
    return (

        <Flex justify='center' align='center' direction='column' width='100%'>

            { selectedFile ? (

                // Display image and return buttons if file selected
                <>
                    <Image src={selectedFile} maxHeight='400px' maxWidth='400px'/>
                    <Stack direction='row' mt='4'>
                        <Button height='28px' onClick={() => setSelectedTab('Post')}>Back to Post</Button>
                        <Button variant='outline' height='28px' onClick={() => setSelectedFile('')}>Remove</Button>
                    </Stack>
                </>

            ) : (
                
                // Display upload button if no file selected
                <Flex justify='center' align='center' p='20' border='1px dashed' borderColor='gray.200' width='100%' borderRadius='4'>
                    <Button variant='outline' height='28px' onClick={() => selectedFileRef.current?.click()}>
                        Upload
                    </Button>
                    <input ref={selectedFileRef} type='file' hidden onChange={onSelectImage}/>
                </Flex>
            
            )}
            
        </Flex>

    )
}
export default ImageUpload;
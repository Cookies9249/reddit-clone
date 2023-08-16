// Contains logic for uploading a file
// Used in About and NewPostForm

import { useState } from 'react';

const useSelectFile = () => {

    const [selectedFile, setSelectedFile] = useState<string>();

    const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();

        // If there is a file, read data
        if (event.target.files?.[0]) {
            reader.readAsDataURL(event.target.files[0]);
        }

        // Runs once readAsDataURL finishes, returning readerEvent
        reader.onload = (readerEvent) => {
            // If the event is successful, set selected file
            if (readerEvent.target?.result) {
                setSelectedFile(readerEvent.target.result as string);
            }
        }
    };
    
    return {
        selectedFile, 
        setSelectedFile,
        onSelectFile,
    }
}
export default useSelectFile;
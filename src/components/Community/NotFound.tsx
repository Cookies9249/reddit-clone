// Displayed when a community is not found
// Used in community page, routes to home page

import { defaultMenuItem } from '@/src/atoms/directoryMenuAtom';
import useDirectory from '@/src/hooks/useDirectory';
import { Flex, Button } from '@chakra-ui/react';
import React, { useState } from 'react';

const CommunityNotFound:React.FC = () => {

    const { onSelectMenuItem } = useDirectory();
    const [loading, setLoading] = useState(false);

    const onGoHome = async () => {
        setLoading(true);
        onSelectMenuItem(defaultMenuItem);
    }
    
    return (
        <Flex direction='column' justifyContent='center' alignItems='center' minHeight='60vh'>
            Sorry, that community does not exist or has been banned
            <Button mt='4' onClick={onGoHome} isLoading={loading} variant={ loading ? 'outline' : 'solid' }>GO HOME</Button>
        </Flex>
    )
}
export default CommunityNotFound;
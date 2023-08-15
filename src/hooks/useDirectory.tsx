import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { DirectoryMenuItem, directoryMenuState } from '../atoms/directoryMenuAtom';
import { useParams, useRouter } from 'next/navigation';
import { communityState } from '../atoms/communityAtoms';
import { FaReddit } from 'react-icons/fa';

const useDirectory = () => {

    const [directoryState, setDirectoryState] = useRecoilState(directoryMenuState);
    const router = useRouter();

    const toggleMenuOpen = () => {
        setDirectoryState(prev => ({...prev,
            open: !directoryState.open,
        }));
    }

    const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {

        // Change selected item in state
        setDirectoryState(prev => ({
            ...prev,
            selectedMenuItem: menuItem,
        }));

        // Route to community
        router.push(menuItem.link);

        // Close menu
        if (directoryState.open) {
            toggleMenuOpen();
        }
    }

    // Updates display text on refresh
    const params = useParams();
    const currentCommunity = useRecoilValue(communityState).currentCommunity;

    const getMenuStateData = () => {

        const menuItem = {
            displayText: `r/${currentCommunity?.id}`,
            link: `/r/${currentCommunity?.id}`,
            icon: FaReddit,
            iconColor: 'blue.500',
            imageURL: currentCommunity?.imageURL,
        };

        setDirectoryState(prev => ({
            ...prev,
            selectedMenuItem: menuItem as DirectoryMenuItem,
        }));
    }
    useEffect(() => {
        if (!params.communityId) return; // if on home page
        getMenuStateData();
    }, [currentCommunity])
    
    return {
        directoryState,
        toggleMenuOpen,
        onSelectMenuItem
    };
}
export default useDirectory;
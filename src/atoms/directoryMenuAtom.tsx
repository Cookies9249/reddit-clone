import { IconType } from 'react-icons';
import { TiHome } from 'react-icons/ti';
import { atom } from 'recoil';

/* When creating an atom, create a type
    an interface state
    a default state
    and the exportable atom */

// Type for selected menu item
export type DirectoryMenuItem = {
    displayText: string;
    link: string;
    icon: IconType;
    iconColor: string;
    imageURL?: string;
}

// Menu for menu state
interface DirectoryMenuState {
    open: boolean;
    selectedMenuItem: DirectoryMenuItem;
}

// Default selected meny item
export const defaultMenuItem: DirectoryMenuItem = {
    displayText: 'Home',
    link: '/',
    icon: TiHome,
    iconColor: 'black',
}

// Default menu state
export const defaultMenuState: DirectoryMenuState = {
    open: false,
    selectedMenuItem: defaultMenuItem,
}

// Export menu state atom
export const directoryMenuState = atom<DirectoryMenuState>({
    key: 'directoryMenuState',
    default: defaultMenuState,
})
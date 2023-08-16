// Recoil documentation: https://recoiljs.org/docs/introduction/getting-started
// Recoil states for auth modals and create community modal

import { atom } from 'recoil';

// Create type AuthModalState
export interface AuthModalState {
    open: boolean;
    view: 'login' | 'signup' | 'resetPassword';
}

// Create default AuthModalState
const defaultAuthModalState: AuthModalState = {
    open: false,
    view: 'login'
};

// Create atom (template from docs)
export const authModalState = atom<AuthModalState>({
    key: 'authModalState',  // unique identifier for atom 
    default: defaultAuthModalState, 
});

// CREATE COMMUNITIES MODAL STATE
export const communityModalState = atom<boolean>({
    key: 'communityModalState',
    default: false,
})
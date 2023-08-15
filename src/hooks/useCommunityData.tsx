import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Community, CommunitySnippet, communityState } from '../atoms/communityAtoms';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebase/clientApp';
import { getDocs, collection, writeBatch, doc, increment, getDoc } from 'firebase/firestore';
import { authModalState } from '@/src/atoms/authModalAtom';
import { useParams } from 'next/navigation';

// Custom hook for using and changing data
// Used in Header component
const useCommunityData = () => {

    const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState);
    const setAuthModalState = useSetRecoilState(authModalState)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user] = useAuthState(auth);
    const params = useParams();

    // Passed to components, used to update community state
    const onJoinOrLeaveCommunity = (communityData: Community, isJoined: boolean) => {
        // If user is not logged in
        if (!user) {
            setAuthModalState( {open: true, view: 'login'} )
            return;
        }

        // If user is logged in and part of community
        if (isJoined) {
            leaveCommunity(communityData.id);
            return;
        }
        
        // If user is logged in and not part of community
        joinCommunity(communityData)
    }

    // Get data and update community state
    const getMySnippets = async () => {
        setLoading(true);
        try {
            // Get snippets from database
            const snippetDocs = await getDocs(collection(firestore, `users/${user?.uid}/communitySnippets`));

            // Convert snippets into objects
            const snippets = snippetDocs.docs.map(doc => ({ ...doc.data() }));

            // Put data in communityStateValue
            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: snippets as CommunitySnippet[],
                snippetsFetched: true,
            }))
            // take previous value, update only mySnippets, everything else remains (...prev)

        } catch (error: any) {
            console.log('getMySnippets error', error)
            setError(error.message)
        }
        setLoading(false);
    }

    // Calls getMySnippets when user changes
    useEffect(() => {
        if (!user) {
            // Log out user
            setCommunityStateValue(prev => ({
                ...prev, 
                mySnippets: [],
                snippetsFetched: false,
            }));
            return;
        }
        getMySnippets();
    }, [user])
    // Clears communityData with user log out
    

    // Joins community, called from onJoinOrLeaveCommunity
    const joinCommunity = async (communityData: Community) => {

        setLoading(true);
        try {

            // Create a new community snippet
            // batch writes: used to only write data to firebase
            const batch = writeBatch(firestore);
            const newSnippet: CommunitySnippet = {
                communityId: communityData.id,
                imageURL: communityData.imageURL || '',
                isModerator: user?.uid === communityData.creatorId,
            };

            // Write batch to database
            batch.set(
                doc(firestore, `users/${user?.uid}/communitySnippets`, communityData.id),
                newSnippet,
            );

            // Update number of members
            batch.update(
                doc(firestore, `communities`, communityData.id),
                { numberOfMembers: increment(1) }
            )

            // Commit changes (required)
            await batch.commit()

            // Update recoil state (communityState.mySnippets)
            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: [...prev.mySnippets, newSnippet]
            }))
            
        } catch (error: any) {
            console.log('joinCommunity error', error)
            setError(error.message)
        }
        setLoading(false);

    }

    // Leaves community, called from onJoinOrLeaveCommunity
    const leaveCommunity = async (communityId: string) => {
        
        setLoading(true);
        try {

            // Delete community snippet
            const batch = writeBatch(firestore);
            
            // Write batch to database
            batch.delete(
                doc(firestore, `users/${user?.uid}/communitySnippets`, communityId),
            );

            // Update number of members
            batch.update(
                doc(firestore, `communities`, communityId),
                { numberOfMembers: increment(-1) }
            )

            // Commit changes (required)
            await batch.commit()

            // Update recoil state (communityState.mySnippets)
            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: prev.mySnippets.filter(item => item.communityId !== communityId)
            }))
            
        } catch (error: any) {
            console.log('leaveCommunity error', error)
            setError(error.message)
        }
        setLoading(false);
        
    }

    // Get community data after refresh
    const getCommunityData = async (communityId: string) => {

        try {
            // Load document from database
            const communityDocRef = doc(firestore, 'communities', communityId);
            const communityDoc = await getDoc(communityDocRef);

            // Convert document into object
            const data = { id: communityDoc.id, ...communityDoc.data() };

            // Set recoil state for current community
            setCommunityStateValue(prev => ({
                ...prev,
                currentCommunity: data as Community,
            }))
            
        } catch (error: any) {
            console.log('fetchCommunityData', error.message);
        }
    }

    // Fetch community data when changing community
    useEffect(() => {

        if (params.communityId && !communityStateValue.currentCommunity) {
            getCommunityData(params.communityId);
        }

    }, [params, communityStateValue.currentCommunity])
    
    // Returns data that can be reached using hook
    // [communityStateValue, onJoinOrLeaveCommunity, loading] = useCommunityData()
    return {
        communityStateValue,
        onJoinOrLeaveCommunity,
        loading,
    }
}
export default useCommunityData;
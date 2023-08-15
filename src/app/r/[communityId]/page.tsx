'use client'

import { Community, communityState } from '@/src/atoms/communityAtoms';
import Header from '@/src/components/Community/Header';
import NotFound from '@/src/components/Community/NotFound';
import PageContent from '@/src/components/Layout/PageContent';
import { firestore } from '@/src/firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'
import CreatePostLink from '@/src/components/Community/CreatePostLink';
import Posts from '@/src/components/Posts/Posts';
import { useRecoilState, useSetRecoilState } from 'recoil';
import About from '@/src/components/Community/Sidebar/About';
import { Spinner } from '@chakra-ui/react';
import PostLoader from '@/src/components/Posts/PostLoader';

const safeJsonStringify = require('safe-json-stringify');

const CommunityPage:React.FC = () => {

    // Get dynamic parameter for communityId
    const communityId = useParams().communityId;

    // States for communityData
    const [communityStateValue, setCommunityStateValue] = useRecoilState(communityState);
    const [fetchStatus, setFetchStatus] = useState('');

    // Fetch community data from database
    const fetchCommunityData = async (communityId: string) => {

        try {
            // Load document from database
            const communityDocRef = doc(firestore, 'communities', communityId);
            const communityDoc = await getDoc(communityDocRef);

            // Convert document into object
            const data = await JSON.parse(safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }));

            // Return result for fetched data
            // setCommunityData(communityDoc.exists() ? data : 'Not Found')

            // Set recoil state for current community
            if (communityDoc.exists()) {
                setCommunityStateValue(prev => ({
                    ...prev,
                    currentCommunity: data as Community,
                }))
            }

            // Set fetch status
            setFetchStatus(
                communityDoc.exists() ? 'Found' : 'Not Found'
            )
            
        } catch (error: any) {
            console.log('fetchCommunityData', error.message)
        }
    }

    // Fetch community data when changing community
    useEffect(() => {
        if (!communityId) return;

        fetchCommunityData(communityId);
    }, [communityId])

    // If loading community data
    if (!communityStateValue.currentCommunity && !fetchStatus) {
        return (
            <PageContent>
                <><PostLoader/></>
                <><PostLoader/></>
            </PageContent>
        );
    } 

    // If community not found
    if (!communityStateValue.currentCommunity && fetchStatus == 'Not Found') {
        return <NotFound/>;
    }

    // If community found
    if (communityStateValue.currentCommunity) {

        console.log('COMMUNITY FOUND', communityStateValue.currentCommunity)
        return (
            <>
                <Header communityData={communityStateValue.currentCommunity}/>
                <PageContent>
                    {/* Left Side */}
                    <>
                        <CreatePostLink/>
                        <Posts communityData={communityStateValue.currentCommunity}/>
                    </>

                    {/* Right Side */}
                    <><About communityData={communityStateValue.currentCommunity}/></>
                </PageContent>
            </>
        )

    }

}

export default CommunityPage;
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
import { useSetRecoilState } from 'recoil';
import About from '@/src/components/Community/About';
import PostLoader from '@/src/components/Posts/PostLoader';

const safeJsonStringify = require('safe-json-stringify');

const CommunityPage:React.FC = () => {

    const fetchCommunityData = async (communityId: string) => {
        
        try {
            // Load data for community
            const communityDocRef = doc(firestore, 'communities', communityId);
            const communityDoc = await getDoc(communityDocRef);
            const data = await JSON.parse(safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }))
            
            return communityDoc.exists() ? data : 'Not Found'
    
        } catch (error) {
            console.log('getServerSideProps error', error)
        }
    }

    // Get dynamic parameter for communityId
    const communityId = useParams().communityId;
    const [communityData, setCommunityData] = useState('');
    const setCommunityStateValue = useSetRecoilState(communityState);

    // Get community data
    useEffect(() => {
        async function getCommunityData() {
            const communityData = await fetchCommunityData(communityId);
            setCommunityData(communityData);
            setCommunityStateValue(prev => ({
                ...prev,
                currentCommunity: communityData as Community,
            }))
        }
        getCommunityData();
    }, [])

    // If loading community data
    if (!communityData) {
        return (
            <PageContent>
                <><PostLoader/></>
                <></>
            </PageContent>
        );
    }

    // If community not found
    if (communityData == 'Not Found') {
        return <NotFound/>;
    }

    // If community found
    return (
        <>
            <Header communityData={communityData}/>
            <PageContent>
                {/* Left Side */}
                <>
                    <CreatePostLink/>
                    <Posts communityData={communityData}/>
                </>

                {/* Right Side */}
                <><About communityData={communityData}/></>
            </PageContent>
        </>
    )

}

// Server side rendering
// Fix: Code is different for Next 13 with app directory
// async function getServerSideProps(context: GetServerSidePropsContext) {
//     console.log("GET SERVER SIDE PROPS RUNNING");
    
//     try {
//         // Load data for community
//         const communityDocRef = doc(firestore, 'communities', communityId);
//         const communityDoc = await getDoc(communityDocRef);
//         const data = await JSON.parse(safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }))
        
//         return 'here is the data'
//         // return { communityData: communityDoc.exists() ? data : 'None' }

//     } catch (error) {
//         console.log('getServerSideProps error', error)
//     }
// }



export default CommunityPage;
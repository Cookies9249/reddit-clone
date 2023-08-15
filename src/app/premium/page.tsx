'use client'

import { communityState } from '@/src/atoms/communityAtoms';
import About from '@/src/components/Community/Sidebar/About';
import PageContent from '@/src/components/Layout/PageContent';
import NewPostForm from '@/src/components/Posts/NewPostForm';
import { auth } from '@/src/firebase/clientApp';
import useCommunityData from '@/src/hooks/useCommunityData';
import { Box, Button, Divider, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaReddit } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';

const PremiumPage:React.FC = () => {
    
    const [user] = useAuthState(auth);
    const router = useRouter();
    const { communityStateValue } = useCommunityData();

    type Perks = {
        title: string,
        text: string,
        new?: boolean,
        imageURL?: string,
    }
    const premiumPerks: Perks[] = [
        {title: 'Ad-free Browsing', text: 'Enjoy redditing without interruptions from ads'},
        {title: 'Exclusive Avatar Gear', text: 'Outfit your avatar with the best gear and accessories', new: true},
        {title: 'Members Lounge', text: 'Discover all the illuminati secrets in r/lounge'},
        {title: 'Custom App Icons*', text: 'Change your app icon to something more your style', new: true}
    ]

    return (

        <Flex direction='column' width='100%' bg='white'>

            <Flex direction='column' align='flex-start' justify='center' p='24' bg='gray.700' pb='175px'> 

                <Stack direction='row' spacing='0.6' align='center' fontSize='9pt' color='brand.100'>

                    <Icon as={FaReddit} fontSize='78px' mr='2'/>
                    <Text fontSize='38pt' fontWeight='800'>Reddit Premium</Text>

                </Stack>

                <Flex width='40%' mt='3' mb='4'>
                    <Text fontSize='12pt' fontWeight='700' color='white'>Help support Reddit and get VIP treatment and exclusive access.</Text>
                </Flex>
                

                <Stack direction='row' spacing='0.6' align='center'>

                    <Button variant='none' color='white' border='1px solid' borderColor='white' height='38px' mr='2' width='240px'>
                        US$5.99/Month
                    </Button>
                    
                    <Button variant='solid_brand' height='38px' mr='2' width='240px'>
                        US$49.99/Year
                        <Flex bg='white' color='brand.100' fontSize='10px' borderRadius='full' p='1.5' ml='2' mt='0.5'>
                            Save 30%
                        </Flex>
                    </Button>

                </Stack>

                <Text fontSize='8pt' mt='4' color='gray.200'>Subscriptions automatically renew</Text>

            </Flex>

            <Flex direction='column' align='center' justify='center' p='10'>

                <Text fontSize='24pt' fontWeight='600'>Join Reddit Premium Today</Text>

                <Stack direction='row' spacing='3' align='center' mt='5'>

                    {premiumPerks.map(item => (

                        <Flex key={item.title} direction='column' bg='gray.50' borderRadius='10' width='160px' p='2'>

                            {item.new && (
                                <Flex position='absolute' bg='brand.100' color='white' fontSize='10px' borderRadius='4' p='2px 4px' fontWeight='700'>
                                    NEW
                                </Flex>
                            )}

                            <Text textAlign='center' fontSize='9pt' fontWeight='600' mb='1' mt='12'>{item.title}</Text>
                            <Text textAlign='center' fontSize='8pt' color='gray.500'>{item.text}</Text>
                        </Flex>

                    ))}

                </Stack>

                {/* Same as above -- too lazy to simplify :D */}
                <Stack direction='row' align='center' mt='5'>
                    <Button variant='none' color='brand.100' border='1px solid' borderColor='brand.100' height='38px' mr='2' width='240px'>
                        US$5.99/Month
                    </Button>
                    
                    <Button variant='solid_brand' height='38px' mr='2' width='240px'>
                        US$49.99/Year
                        <Flex bg='white' color='brand.100' fontSize='10px' borderRadius='full' p='1.5' ml='2' mt='0.5'>
                            Save 30%
                        </Flex>
                    </Button>
                </Stack>

                <Text fontSize='8pt' mt='2.5' color='gray.500'>Subscriptions automatically renew</Text>
                <Text fontSize='8pt' mt='3' color='gray.500'>* Custom app icons are only available through a paid Reddit Premium subscription.</Text>

                <Button variant='oauth' fontSize='8pt' fontWeight='600' mt='6'
                    onClick={() => router.push('https://support.reddithelp.com/hc/en-us/articles/360043034412-What-is-a-Reddit-premium-membership-')}>
                    Visit the Reddit Premium FAQs
                </Button>

            </Flex>

            <Flex p='7' pt='12' justify='center' bg='gray.700'>

                <Flex width='50%' direction='column' justify='center' fontSize='10pt'>

                    <Stack direction='row' mb='9'>

                        <Flex direction='column' color='white' width='25%' p='10px 35px'>
                            <Text>About</Text>
                            <Text mt='4'>Careers</Text>
                            <Text mt='4'>Press</Text>
                        </Flex>

                        <Flex direction='column' color='white' width='25%' p='10px 35px'
                            borderRight='1px solid' borderColor='gray.500'>
                            <Text>Advertise</Text>
                            <Text mt='4'>Blog</Text>
                            <Text mt='4'>Help</Text>
                        </Flex>

                        <Flex direction='column' color='white' width='25%' pl='30px' pt='10px'>
                            <Text>Reddit Premium</Text>
                        </Flex>

                        <Flex direction='column' color='white' width='25%' p='10px 35px'
                            borderLeft='1px solid' borderColor='gray.500'>
                            <Text>Facebook</Text>
                            <Text mt='4'>Twitter</Text>
                            <Text mt='4'>Instagram</Text>
                        </Flex>

                    </Stack>

                    <Stack direction='row' width='100%' color='gray.200' justify='space-between'>
                        <Text textDecoration={'underline'}>Content Policy</Text>
                        <Text textDecoration={'underline'}>Privacy Policy</Text>
                        <Text textDecoration={'underline'}>User Agreement</Text>
                        <Text textDecoration={'underline'}>Mod Policy</Text>
                        <Text>Reddit, Inc. © 2023. All rights reserved.</Text>
                    </Stack>

                </Flex>

            </Flex>

        </Flex>
        
    )
}
export default PremiumPage;
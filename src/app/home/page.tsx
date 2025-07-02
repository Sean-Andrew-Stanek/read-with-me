'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { FC } from 'react';
import { Check } from 'lucide-react';
import { Info } from 'lucide-react';
import { getRandomStoryId } from '@/services/apiServices';
import LoadingSpinner from '@/components/LoadingSpinner';
import DefaultHomePanels from '@/components/DefaultHomePanels';
import ReadStoryExpandedPanel from '@/components/ReadStoryExpandedPanel';
import ChallengesExpandedPanel from '@/components/ChallengesExpandedPanel';

const Dashboard: FC = () => {
    const [readOpen, setReadOpen] = useState(false);
    const [challengesOpen, setChallengesOpen] = useState(false);

    useEffect(() => {
        const toastType = localStorage.getItem('toast');
        localStorage.removeItem('toast');

        setTimeout(() => {
            if (toastType === 'grade-saved') {
                toast.success('Grade level saved successfully!', {
                    icon: <Check className="h-5 w-5 text-green-500" />,
                    style: {
                        color: 'rgb(22 163 74)',
                        borderColor: 'rgb(134 239 172)'
                    }
                });
            } else if (toastType === 'grade-skipped') {
                toast.info(
                    'For better experience, please select your grade level!',
                    {
                        icon: <Info className="h-5 w-5 text-blue-500" />,
                        style: {
                            color: 'rgb(50 130 246)',
                            borderColor: 'rgb(101 219 254)'
                        }
                    }
                );
            } else if (toastType === 'google-signin') {
                toast.success('Signed in successfully!', {
                    icon: <Check className="h-5 w-5 text-green-500" />,
                    style: {
                        color: 'rgb(22 163 74)',
                        borderColor: 'rgb(134 239 172)'
                    }
                });
            }
        }, 600); // Delay to allow the toast to be displayed after the page load
    }, []);

    const [randomStoryId, setRandomStoryId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRandomId = async (): Promise<void> => {
            try {
                const id = await getRandomStoryId();
                setRandomStoryId(id);
            } catch {
                toast.error(
                    'You have not created any story yet. Try creating one!'
                );
            } finally {
                setLoading(false);
            }
        };
        fetchRandomId();
    }, []);

    if (loading) return <LoadingSpinner />

    return (
        <div className="relative flex flex-col gap-5 items-center mt-10 min-h-screen max-w-screen-2xl mx-auto overflow-x-hidden w-[85%]">

            {!readOpen && !challengesOpen && (
                <DefaultHomePanels
                    randomStoryId={randomStoryId}
                    setReadOpen={setReadOpen}
                    setChallengesOpen={setChallengesOpen}
                />
            )}

            {readOpen && (
                <ReadStoryExpandedPanel
                    randomStoryId={randomStoryId}
                    setReadOpen={setReadOpen}
                />
            )}

            {challengesOpen && (
                <ChallengesExpandedPanel 
                    randomStoryId={randomStoryId}
                    setReadOpen={setReadOpen}
                    setChallengesOpen={setChallengesOpen}
                />
            )}
        </div>
    );
};

export default Dashboard;

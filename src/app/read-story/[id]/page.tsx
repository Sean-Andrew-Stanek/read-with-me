'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getStoryById } from '../../../services/apiServices';
import { Story } from '../../../lib/types/story';
import { SpeechToText } from '../../../components/SpeechToText';
const ReadStory = () => {
    const { id } = useParams();
    const [story, setStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStory = async () => {
            if (!id) return;
            try {
                const fetchedStory = await getStoryById(id as string);
                setStory(fetchedStory);
            } catch (error) {
                console.error('Error fetching story:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStory();
    }, [id]);

    if (loading) return <p>Loading story...</p>;
    if (!story) return <p>Story not found.</p>;

    return (
        <div>
            <div className="container mx-auto py-10 max-w-2xl">
                <h1 className="text-3xl font bold mb-4">{story.title}</h1>
                <p className="mb-6 text-lg text-black">{story.content}</p>
                <p className="text-sm text-blue-900">
                    Created At: {new Date(story.createdAt).toLocaleString()}
                </p>
            </div>
            <div className="mt-6 flex-1">
                <SpeechToText />
            </div>
        </div>
    );
};

export default ReadStory;

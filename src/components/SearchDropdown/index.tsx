'use client';

import { useCallback, useEffect, useState } from 'react';
import { X, Search } from 'lucide-react';
import { getStories } from '@/services/apiServices';
import type { Story } from '@/lib/types/story';
import { Button } from '../ui/button';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const SearchDropdown: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Story[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();

    const searchStories = useCallback(async () => {
        setLoading(true);
        setError(null);

        const uuid = (session?.user as { uuid: string })?.uuid;
        const isParent = (session?.user as { isParent: boolean })?.isParent;

        try {
            const parentId = isParent ? uuid : undefined;
            const childId = !isParent ? uuid : undefined;
            const stories = await getStories(parentId, childId);
            const filtered = stories.filter(
                story =>
                    story.title.toLowerCase().includes(query.toLowerCase()) ||
                    story.content.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        } catch {
            setError('Failed to fetch stories');
        } finally {
            setLoading(false);
        }
    }, [query, session]);

    useEffect(() => {
        if (query.length > 1) {
            setOpen(true);
            searchStories();
        } else {
            setOpen(false);
            setResults([]);
        }
    }, [query, session, searchStories]);

    const closeSearch = (): void => {
        setOpen(false);
        setQuery('');
        setResults([]);
    };

    return (
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
            <div className="flex items-center bg-gray/20 backdrop-blur-md rounded-xl px-4 py-2 shadow-md w-72">
                <Search className="text-white size-12 mr-2" />
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder=""
                    className="bg-transparent placeholder-gray-600 text-gray-600 outline-none flex-grow"
                />
                {open && (
                    <Button onClick={closeSearch} className="bg-indigo-200">
                        <X className="text-white  bg-transparent size-5" />
                    </Button>
                )}
            </div>
            {open && (
                <div className="absolute mt-2 right-0 bg-white/20 backdrop-blur-md rounded-xl shadow-xl p-4 w-72 text-gray-600 space-y-2 max-h-80 overflow-y-auto">
                    {loading ? (
                        <div className="text-center">Loading ...</div>
                    ) : error ? (
                        <div className="text-red-500">{error}</div>
                    ) : results.length === 0 ? (
                        <div className="text-center opacity-70">
                            No stories found.
                        </div>
                    ) : (
                        results.map(story => (
                            <Link
                                key={story.id}
                                href={`/read-story/${story.id}`}
                                onClick={closeSearch}
                                className="block"
                            >
                                <div className="flex justify-between items-center px-2 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-5 h-5 bg-white rounded-sm" />
                                        <span>{story.title}</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchDropdown;

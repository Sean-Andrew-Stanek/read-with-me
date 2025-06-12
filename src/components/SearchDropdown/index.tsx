import { Story } from "@/lib/types/story";
import { getStories } from "@/services/apiServices";
import { Search, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const SearchDropdown: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Story[]>([]);
    const [open, setOpen] = useState(false); // controls input visibility
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
            searchStories();
        } else {
            setResults([]);
        }
    }, [query, searchStories]);

    const toggleSearch = (): void => {
        setOpen(prev => !prev);
        if (open) {
            setQuery('');
            setResults([]);
        }
    };

    return (
        <div className="relative">
            <div
                className={`flex items-center bg-white/40 backdrop-blur-md rounded-xl px-4 py-2 shadow-md transition-all duration-300 ${open ? 'w-72' : 'w-25 rounded-2xl justify-center'
                    }`}
            >
                {!open ? (
                    <button onClick={toggleSearch}>
                        <Search className="text-white w-20 h-20" />
                    </button>
                ) : (
                    <>
                        <Search className="text-gray-500 size-5 mr-2" />
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search stories..."
                            className="bg-transparent placeholder-gray-500 text-gray-800 outline-none flex-grow"
                            autoFocus
                        />
                        <button onClick={toggleSearch}>
                            <X className="text-gray-600 size-5" />
                        </button>
                    </>
                )}
            </div>

            {open && query && (
                <div className="absolute mt-2 right-0 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl p-4 w-72 text-gray-700 space-y-2 max-h-80 overflow-y-auto">
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
                                onClick={toggleSearch}
                                className="block"
                            >
                                <div className="flex justify-between items-center px-2 py-1 bg-white/70 rounded-lg hover:bg-white/90 transition">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-5 h-5 bg-indigo-200 rounded-sm" />
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
import { Story } from '@/lib/types/story';
import { getStories } from '@/services/apiServices';
import { Search, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button'; 

const SearchDropdown: React.FC = () => {
  const [query, setQuery]   = useState('');
  const [results, setResults] = useState<Story[]>([]);
  const [open, setOpen]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const { data: session }   = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const searchStories = useCallback(async () => {
    setLoading(true);
    setError(null);

    const uuid     = (session?.user as { uuid: string })?.uuid;
    const isParent = (session?.user as { isParent: boolean })?.isParent;

    try {
      const parentId = isParent ? uuid : undefined;
      const childId  = !isParent ? uuid : undefined;
      const stories  = await getStories(parentId, childId);
      const filtered = stories.filter(
        s =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.content.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } catch {
      setError('Failed to fetch stories');
    } finally {
      setLoading(false);
    }
  }, [query, session]);

  useEffect(() => {
    if (query.length > 1) searchStories();
    else                   setResults([]);
  }, [query, searchStories]);

  const toggleSearch = (): void => {
    setOpen(p => !p);
    if (open) {
      setQuery('');
      setResults([]);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setOpen(false);
            setQuery('');
            setResults([]);
        }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return (): void => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      {open ? (
       <div className="flex items-center w-72 bg-white/40 backdrop-blur-md rounded-xl px-4 py-2 shadow-md transition-all duration-300">
          <Search className="mr-2 size-10 text-white shrink-0 font-bold" />

          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search stories..."
            className="flex-grow bg-transparent placeholder-white/60 text-gray-700 focus:outline-none"
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSearch}
            className="h-12 w-12 hover:bg-white/20"
          >
            <X className="size-10 text-gray-300" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSearch}
          className="h-20 w-20 rounded-xl bg-white/30 hover:bg-white/40
             backdrop-blur-md border border-white/30 shadow-lg flex items-center justify-center"
        >
          <Search className="size-18 text-white" />
        </Button>
      )}

      {open && query && (
        <div className="absolute right-0 mt-2 w-72 space-y-2 rounded-xl bg-white/90 p-4 shadow-xl backdrop-blur-xl max-h-80 overflow-y-auto text-gray-700">
          {loading ? (
            <div className="text-center">Loading …</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : results.length === 0 ? (
            <div className="opacity-70 text-center">No stories found.</div>
          ) : (
            results.map(story => (
              <Link
                key={story.id}
                href={`/read-story/${story.id}`}
                onClick={toggleSearch}
                className="block"
              >
                <div className="flex items-center justify-between rounded-lg bg-white/70 px-2 py-1 transition hover:bg-white/90">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 rounded-sm bg-indigo-200" />
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

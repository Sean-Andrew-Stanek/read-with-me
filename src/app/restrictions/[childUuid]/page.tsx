'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useParams, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

const ChildRestrictionsPage: React.FC = () => {
    const { childUuid } = useParams() as { childUuid: string };
    const searchParams = useSearchParams();
    const childName = searchParams.get('name');

    const [blacklistedWords, setBlacklistedWords] = useState('');
    const [restrictedGenres, setRestrictedGenres] = useState('');
    const [notes, setNotes] = useState('');

    // fetch exisiting restrictions
    useEffect(() => {
        const fetchRestrictionData = async (): Promise<void> => {
            try {
                const res = await fetch(`/api/restrictions/${childUuid}`);
                if (!res.ok) return;
                const data = await res.json();

                if (
                    data.blacklistedWords &&
                    Array.isArray(data.blacklistedWords)
                ) {
                    setBlacklistedWords(data.blacklistedWords.join(', '));
                }

                if (
                    data.restrictedGenres &&
                    Array.isArray(data.restrictedGenres)
                ) {
                    setRestrictedGenres(data.restrictedGenres.join(', '));
                }

                if (data.notes) {
                    setNotes(data.notes);
                }
            } catch {
                toast.error('Failed to load restrictions.');
            }
        };
        fetchRestrictionData();
    }, [childUuid]);

    const handleSave = async (): Promise<void> => {
        try {
            const res = await fetch(`/api/restrictions/${childUuid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blacklistedWords: blacklistedWords
                        .split(',')
                        .map(w => w.trim())
                        .filter(Boolean),
                    restrictedGenres: restrictedGenres
                        .split(',')
                        .map(g => g.trim())
                        .filter(Boolean),
                    notes
                })
            });
            if (res.ok) {
                toast.success('Restrictions saved!');
            } else {
                const data = await res.json();
                toast.error(
                    data.error?.message || 'Failed to save restrictions'
                );
            }
        } catch {
            toast.error('Error saving restrictions.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-6">
                Set Restrictions for Child: {childName || 'Unnamed Child'}
            </h1>

            <div className="space-y-6">
                {/* Blacklisted Words */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Blacklisted Words
                    </label>
                    <textarea
                        className="w-full border rounded p-2"
                        rows={3}
                        value={blacklistedWords}
                        onChange={e => setBlacklistedWords(e.target.value)}
                        placeholder="e.g. kill, gun, horror"
                    />
                </div>

                {/* Restricted Genres */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Restricted Genres
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={restrictedGenres}
                        onChange={e => setRestrictedGenres(e.target.value)}
                        placeholder="e.g. Horror, Thriller"
                    />
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Other Notes
                    </label>
                    <textarea
                        className="w-full border rounded p-2"
                        rows={3}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Any additional rules..."
                    />
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button
                        onClick={handleSave}
                        className="bg-yellow-400 text-white hover:bg-yellow-500 cursor-pointer"
                    >
                        Save Restrictions
                    </Button>
                </div>
            </div>
        </div>
    );
};
export default ChildRestrictionsPage;

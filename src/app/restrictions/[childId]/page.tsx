'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const ChildRestrictionsPage: React.FC = () => {
    const [blacklistedWords, setBlacklistedWords] = useState('');
    const [restrictedGenres, setRestrictedGenres] = useState('');
    const [notes, setNotes] = useState('');

    const handleSave = (): void => {
        alert('Restrictions saved!');
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-6">
                Set Restrictions for Child: Temporaty Child
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

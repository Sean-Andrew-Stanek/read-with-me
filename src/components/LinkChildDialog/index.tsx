'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { grades } from '@/lib/constants/grades';

const LinkChildDialog = ({
    open,
    onClose
}: {
    open: boolean;
    onClose: () => void;
}) => {
    const [userName, setUserName] = useState('');
    const [grade, setGrade] = useState<number | ''>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/user', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, grade })
        });

        const data = await res.json();

        if (res.ok) {
            toast.success('Child linked successfully!');
            setUserName('');
            setGrade('');
            onClose();
        } else {
            toast.error(data.error || 'Something went wrong');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Link a Child Account</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Child's Username"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />

                    <select
                        value={grade}
                        onChange={e => setGrade(Number(e.target.value))}
                        className="border p-2 rounded"
                        required
                    >
                        <option value="">Select Grade</option>
                        {Object.entries(grades).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Link Child
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default LinkChildDialog;

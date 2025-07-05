'use client';

import { useState, FormEvent, ChangeEvent, FC, JSX } from 'react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type EnterTokenDialogProps = {
    open: boolean;
    onClose: () => void;
    onLinked: () => void;
};

const EnterTokenDialog: FC<EnterTokenDialogProps> = ({
    open,
    onClose,
    onLinked
}): JSX.Element => {
    const [token, setToken] = useState<string>('');

    const handleSubmit = async (
        e: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        const res = await fetch('/api/token', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        });

        const data = await res.json();

        if (res.ok) {
            toast.success('Linked to your parent successfully!');
            setToken('');
            onLinked(); // refresh UI or session
            onClose();
        } else {
            toast.error(data.error || 'Invalid token');
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setToken(e.target.value.toUpperCase());
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="[&>button]:cursor-pointer">
                <DialogHeader>
                    <DialogTitle>Enter Parent Token</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        value={token}
                        onChange={handleChange}
                        placeholder="Enter 6-character token"
                        maxLength={6}
                        required
                        className="border p-2 rounded text-center uppercase tracking-widest"
                    />
                    <Button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                    >
                        Submit
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EnterTokenDialog;

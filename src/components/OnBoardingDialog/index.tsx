import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { navLink } from '@/config/navigation';
import { putUserGrade } from '@/services/apiServices';
import { grades } from '@/lib/constants/grades';
import { toast } from 'sonner';

interface OnboardingDialogProps {
    open: boolean;
    onOnboarded: () => void;
}

const OnboardingDialog: React.FC<OnboardingDialogProps> = ({
    open,
    onOnboarded
}) => {
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
    const { update } = useSession();

    const { data: session } = useSession();

    const router = useRouter();
    if (!open) return null;

    const handleSubmit = async (): Promise<void> => {
        if (!session || !session.user || !session.user.uuid) return;

        if (selectedGrade === null) {
            toast.error('Please pick a grade');
            return;
        }

        await putUserGrade(selectedGrade.toString(), session.user.uuid);

        // Update the session with the new grade in session
        await update();

        localStorage.setItem('toast', 'grade-saved');
        onOnboarded();
        router.push(navLink.dashboard); // Redirect to the dashboard after saving
    };

    const handleCancel = (): void => {
        if (selectedGrade === null) {
            toast.error('Please pick a grade before continuing');
            return; // block closing
        }
        onOnboarded(); // close without saving
        router.push(navLink.home); // Redirect to the home page
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center select-none">
            <div className="relative bg-white rounded-md shadow-md w-full max-w-md mx-4 max-h-screen flex flex-col p-4">
                {/* Close button */}
                <button
                    onClick={handleCancel}
                    className="absolute cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                    aria-label="Close"
                >
                    ×
                </button>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Tell us your grade level
                </h2>
                <div className="mb-4 flex-1 overflow-y-auto">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Select your grade level:
                    </label>
                    <div className="space-y-2">
                        {Object.entries(grades).map(([gradeStr, label]) => {
                            const grade = parseInt(gradeStr, 10);
                            return (
                                <div
                                    key={grade}
                                    className="flex items-center rounded-md p-1 transition-colors duration-200 hover:bg-gray-100 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        id={`grade-${grade}`}
                                        name="grade"
                                        value={grade}
                                        className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        checked={selectedGrade === grade}
                                        onChange={() => setSelectedGrade(grade)}
                                    />
                                    <label
                                        htmlFor={`grade-${grade}`}
                                        className="ml-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                                    >
                                        {label}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex justify-end mt-auto">
                    <button
                        className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={handleSubmit}
                        disabled={selectedGrade === null}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OnboardingDialog;

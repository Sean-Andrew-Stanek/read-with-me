import { useState } from 'react';
import { useRouter } from 'next/router';

interface OnboardingDialogProps {
  onOnboarded: () => void;
}

const grades: Record<number, string> = {
  0: "Kindergarten",
  1: "1st Grade",
  2: "2nd Grade",
  3: "3rd Grade",
  4: "4th Grade",
  5: "5th Grade",
  6: "6th Grade",
  7: "7th Grade",
  8: "8th Grade",
  9: "9th Grade",
  10: "10th Grade",
  11: "11th Grade",
  12: "12th Grade",
};

const OnboardingDialog: React.FC<OnboardingDialogProps> = ({ onOnboarded }) => {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const router = useRouter();

  const handleSubmit = () => {
    if (selectedGrade === null) {
      alert('Please select your grade level.');
      return;
    }

    console.log('Selected Grade Level:', selectedGrade);
    onOnboarded();
    router.push('/home');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Tell us your grade level</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select your grade level:
          </label>
          <div className="space-y-2">
            {Object.entries(grades).map(([gradeStr, label]) => {
              const grade = parseInt(gradeStr, 10);
              return (
                <div key={grade} className="flex items-center">
                  <input
                    type="radio"
                    id={`grade-${grade}`}
                    name="grade"
                    value={grade}
                    className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    checked={selectedGrade === grade}
                    onChange={() => setSelectedGrade(grade)}
                  />
                  <label htmlFor={`grade-${grade}`} className="ml-2 text-gray-700">
                    {label}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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

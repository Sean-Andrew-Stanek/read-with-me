import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Eye, Lock, UserPlus, UserMinus } from 'lucide-react';
import { JSX } from 'react';

const IconBubble = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <div className="flex items-center justify-center size-10 rounded-full bg-yellow-400 text-white">
    {children}
  </div>
);

const ParentDashboard = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#dbeafe] to-[#fce7f3] py-12">
      <div className="text-center text-3xl font-bold text-gray-800">Parent Dashboard</div>

      <div className="mx-auto mt-12 max-w-4xl bg-white/50 backdrop-blur-md rounded-3xl shadow-lg p-10">
        <div className="flex flex-col space-y-6">
          <div>
            <Link href="#">
              <Button className="w-full h-auto flex justify-start items-center gap-4 text-lg font-semibold text-gray-700 bg-white/70 hover:bg-yellow-400 hover:text-white rounded-2xl py-4 px-6 transition duration-300 shadow-md backdrop-blur-md">
                <IconBubble><Eye className="size-7" /></IconBubble>
                View a child
              </Button>
            </Link>
          </div>

          <div>
            <Link href="#">
              <Button className="w-full h-auto flex justify-start items-center gap-4 text-lg font-semibold text-gray-700 bg-white/70 hover:bg-yellow-400 hover:text-white rounded-2xl py-4 px-6 transition duration-300 shadow-md backdrop-blur-md">
                <IconBubble><Lock className="size-7" /></IconBubble>
                Add Restrictions
              </Button>
            </Link>
          </div>

          <div>
            <Link href="#">
              <Button className="w-full h-auto flex justify-start items-center gap-4 text-lg font-semibold text-gray-700 bg-white/70 hover:bg-yellow-400 hover:text-white rounded-2xl py-4 px-6 transition duration-300 shadow-md backdrop-blur-md">
                <IconBubble><UserPlus className="size-7" /></IconBubble>
                Add a child
              </Button>
            </Link>
          </div>

          <div>
            <Link href="#">
              <Button className="w-full h-auto flex justify-start items-center gap-4 text-lg font-semibold text-gray-700 bg-white/70 hover:bg-yellow-400 hover:text-white rounded-2xl py-4 px-6 transition duration-300 shadow-md backdrop-blur-md">
                <IconBubble><UserMinus className="size-7" /></IconBubble>
                Remove a child
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;

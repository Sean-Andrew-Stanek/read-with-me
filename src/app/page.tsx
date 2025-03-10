import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
            <h1 className="text-2xl  md:text-4xl  font-bold">
                Welcome to Read With Me
            </h1>
            <p className="text-gray-600 mt-2 text-lg md:text-xl lg:text-2xl">
                Temporary landing page.
            </p>
            <Link href="/signin">
                <Button className="mt-4 md:w-auto py-3 md:py-6 lg:py-6 md:text-xl text-base bg-red-400 text-white rounded font-medium">
                    Get Started
                </Button>
            </Link>
        </div>
    );
};

export default Home;

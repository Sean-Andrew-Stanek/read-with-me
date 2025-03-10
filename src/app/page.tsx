import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
            <h1 className="text-3xl font-bold">Welcome to Read With Me</h1>
            <p className="text-gray-600 mt-2">Temporary landing page.</p>
            <Link href="/signin">
                <Button className="mt-4 px-4 py-2 bg-red-400 text-white rounded">
                    Get Started
                </Button>
            </Link>
        </div>
    );
};

export default Home;

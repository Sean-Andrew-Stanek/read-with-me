import Link from 'next/link';
// import { Button } from '@/components/ui/button';
import { frontPage as strings } from '@/config/strings';
const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
            <h1 className="text-2xl  md:text-4xl  font-bold">
                {strings.welcome}
            </h1>
            <p className="text-gray-600 mt-2 text-lg md:text-xl lg:text-2xl">
                {strings.description}
            </p>
            <Link
                href="/child-login"
                className="mt-6 inline-block bg-red-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition duration-200 cursor-pointer"
            >
                Child Login
            </Link>
        </div>
    );
};

export default Home;

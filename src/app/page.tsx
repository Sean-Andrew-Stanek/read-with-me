// import Link from 'next/link';
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
        </div>
    );
};

export default Home;

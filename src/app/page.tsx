import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { frontPageStrings as strings } from '@/config/strings';
import { navLink } from '@/config/navigation';

const Home: React.FC = async () => {
    const session = await auth();
    if (session) {
        redirect(navLink.dashboard);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
            <h1 className="text-lg md:text-4xl  font-bold">
                {strings.welcome}
            </h1>
            <p className="text-gray-600 mt-2 text-lg md:text-xl lg:text-2xl">
                {strings.description}
            </p>
        </div>
    );
};

export default Home;

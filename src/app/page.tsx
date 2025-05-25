import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { frontPageStrings as strings } from '@/config/strings';
import { navLink } from '@/config/navigation';
import Image from 'next/image';

const Home: React.FC = async () => {
    const session = await auth();
    if (session) {
        redirect(navLink.dashboard);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
            <h1 className="text-lg md:text-5xl font-bold mt-10">
                {strings.welcome}
            </h1>
            {/* <p className="text-gray-600 mt-2 text-lg md:text-xl lg:text-2xl">
                {strings.description}
            </p> */}
            <Image
                src="/simple-logo.png"
                alt="Read With Me First Page"
                width={600}
                height={400}
                className="mt-3 rounded-lg"
            />
        </div>
    );
};

export default Home;

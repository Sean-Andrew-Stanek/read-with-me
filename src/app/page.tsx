import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { frontPageStrings as strings } from '@/config/strings';
import { navLink } from '@/config/navigation';
import Image from 'next/image';
import { roboto, literata } from './fonts';

const Home: React.FC = async () => {
    const session = await auth();
    if (session) {
        redirect(navLink.dashboard);
    }

    return (
            <div className={`${roboto.variable} ${literata.variable} flex flex-col items-center justify-center min-h-screen text-gray-900`} >
            <h1 className="text-lg md:text-5xl font-bold mt-10">
                {strings.welcome}
            </h1>
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

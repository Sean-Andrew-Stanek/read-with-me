import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { frontPageStrings as strings } from '@/config/strings';
import { navLink } from '@/config/navigation';
import Image from 'next/image';
import { roboto, literata } from './fonts';
import { Button } from '@/components/ui/button';

const Home: React.FC = async () => {
    const session = await auth();
    if (session) {
        redirect(navLink.dashboard);
    }

    return (
        <div className={`${roboto.variable} ${literata.variable} min-h-screen flex items-center justify-center bg-gradient-to-r from-[#d6e8f5] to-[#fef7fd] relative overflow-hidden px-4`}>
            <div className="hidden md:block absolute right-0 bottom-0 z-0">
                <Image
                    src="/welcome.png"
                    alt="Illustration"
                    width={900}
                    height={900}
                    className="object-contain"
                />
            </div>
            <div className="z-10 bg-white rounded-3xl shadow-lg max-w-2xl w-full p-10 text-center">
                <h1 className="text-4xl font-bold text-purple-600 mb-6">{strings.welcome}</h1>
                <p className="text-gray-700 mb-8">
                    Our app is a unique way to take advantage of the power of AI to provide limitless ways of
                    improving your reading skills. Take advantage of a vast amount of self-generated
                    libraries and crafted selections to match your favourite literary genres and aspirations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-purple-600 text-white px-6 py-3 rounded-md text-sm hover:bg-purple-700">
                        Explore the app →
                    </Button>
                    <Button
                        variant="outline"
                        className="border border-purple-500 text-purple-600 hover:bg-purple-100 px-6 py-3 rounded-md text-sm"
                    >
                        Take a tour →
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Home;

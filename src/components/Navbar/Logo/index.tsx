import Link from 'next/link';
import Image from 'next/image';

const Logo: React.FC = () => {
    return (
        <Link
            href="/"
            className="text-md md:text-3xl items-center justify-center font-semibold ml-10 mt-7"
        >
            <Image
                src="/logo.svg"
                alt="Logo"
                width={250}
                height={150}
                priority
                className="object-contain"
            />
        </Link>
    );
};

export default Logo;

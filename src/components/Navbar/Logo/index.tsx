import Link from 'next/link';

const Logo: React.FC = () => {
    return (
        <Link
            href="/"
            className="text-md md:text-3xl items-center justify-center font-semibold mt-7"
        >
            Read With Me
        </Link>
    );
};

export default Logo;

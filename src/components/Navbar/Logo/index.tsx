import Link from 'next/link';

const Logo: React.FC = () => {
    return (
        <Link
            href="/"
            className="text-lg md:text-2xl items-center justify-center font-bold"
        >
            Read With Me
        </Link>
    );
};

export default Logo;

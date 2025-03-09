import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="flex justify-between py-4 bg-red-400 text-white p-4">
            <Link href="/" className="text-2xl font-bold">
                Read With Me
            </Link>
        </nav>
    );
};

export default Navbar;

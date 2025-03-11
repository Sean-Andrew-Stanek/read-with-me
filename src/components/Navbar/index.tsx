import Logo from './Logo';

const Navbar: React.FC = () => {
    return (
        <nav className="flex justify-between py-4 bg-red-400 text-white p-4">
            <Logo />
        </nav>
    );
};

export default Navbar;

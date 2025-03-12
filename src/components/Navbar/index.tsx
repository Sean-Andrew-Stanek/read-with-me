import Logo from './Logo';
import AuthDialog from './AuthDialog';

const Navbar: React.FC = () => {
    return (
        <nav className="flex justify-between items-center py-4 bg-red-400 text-white p-4">
            <Logo />
            <AuthDialog />
        </nav>
    );
};

export default Navbar;

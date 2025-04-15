import Logo from './Logo';
import AuthDialog from './AuthDialog';
import Signup from './Signup';

const Navbar: React.FC = () => {
    return (
        <nav className="flex justify-between items-center py-4 bg-red-400 text-white p-4">
            <Logo />
            <div className="flex items-center gap-2">
                <Signup />
                <AuthDialog />
            </div>
        </nav>
    );
};

export default Navbar;

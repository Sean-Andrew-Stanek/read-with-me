import Link from 'next/link';

interface DashboardSidebarLinkProps {
    href: string;
    title: string;
}

const DashboardSidebarLink: React.FC<DashboardSidebarLinkProps> = ({
    href,
    title
}) => {
    return (
        <Link
            href={href}
            className="block text-sm sm:text-md md:text-lg lg:text-xl text-gray-900 hover:text-red-500 hover:text-2xl"
        >
            {title}
        </Link>
    );
};
export default DashboardSidebarLink;

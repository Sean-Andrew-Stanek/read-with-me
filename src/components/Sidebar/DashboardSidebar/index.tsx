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
        <Link href={href} className="block text-gray-900 hover:text-red-500 hover:text-2xl">
            {title}
        </Link>
    );
};
export default DashboardSidebarLink;

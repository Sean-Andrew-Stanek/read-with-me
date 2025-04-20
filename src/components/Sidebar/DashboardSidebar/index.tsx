import { Link } from 'lucide-react';

interface DashboardSidebarLinkProps {
    href: string;
    title: string;
}

const DashboardSidebarLink: React.FC<DashboardSidebarLinkProps> = ({
    href,
    title
}) => {
    return (
        <Link href={href} className="block text-gray-700 hover:text-red-500">
            {title}
        </Link>
    );
};
export default DashboardSidebarLink;

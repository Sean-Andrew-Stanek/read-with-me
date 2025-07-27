type pendingRequests = {
    token: string;
    childName: string;
    childId: string;
};
type PendingRequestsProps = {
    pendingRequests: pendingRequests[];
    handleApprove: (token: string) => Promise<void>;
    handleReject: (token: string) => Promise<void>;
    onClose?: () => void;
};
const PendingRequests: React.FC<PendingRequestsProps> = ({
    pendingRequests,
    handleApprove,
    handleReject,
    onClose
}) => {
    return (
        <div>
            {/**Parent view, pending requests */}
            {pendingRequests.length > 0 && (
                <div className="mt-6 w-full bg-yellow-50 border border-yellow-300 rounded-xl p-4 shadow-sm">
                    <h3 className="font-semibold text-lg mb-2">
                        Pending Requests:
                    </h3>
                    <ul className="space-y-2">
                        {pendingRequests.map(req => (
                            <li
                                key={req.childId}
                                className="flex justify-between items-center"
                            >
                                <span>{req.childName}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={async () => {
                                            if (req.token) {
                                                await handleApprove(req.token);
                                                onClose?.();
                                            }
                                        }}
                                        className="px-3 py-1 text-sm text-white bg-green-600 hover:bg-green-700 rounded cursor-pointer"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (req.token) {
                                                await handleReject(req.token);
                                                onClose?.();
                                            }
                                        }}
                                        className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded cursor-pointer"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
export default PendingRequests;

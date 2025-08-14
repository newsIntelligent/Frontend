import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { label: '구독', path: '/subscriptions', key: 'subscription' },
        { label: '읽은 토픽', path: '/read-topic', key: 'readTopic' },
        { label: '활동', path: '/activity', key: 'activity', disabled: true },
        { label: '멤버쉽', path: '/membership', key: 'membership', disabled: true },
        { label: '신고', path: '/report', key: 'report', disabled: true },
        { label: '알림', path: '/notification', key: 'notification' },
        { label: '설정', path: '/settings', key: 'settings' },
    ];

    return (
        <div className="flex flex-1 text-[#07525F] w-[207px] h-[288px]">
            <div className="h-full pl-[24px] border-l-4 border-[#07525F]">
                <div className="flex flex-col gap-4">
                    <p className="text-2xl font-bold text-black"> 마이페이지 </p>

                    <div className="flex flex-col space-y-3">
                        {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const textColor = isActive ? 'text-[#07525F] font-bold' : 'text-[#919191] font-medium';
                        const prefix = isActive ? '· ' : '';

                        if (item.disabled) {
                            return (
                            <span key={item.key} className={`text-base text-left ${textColor}`}>
                                {item.label}
                            </span>
                            );
                        }

                        return (
                            <button
                            key={item.key}
                            onClick={() => navigate(item.path)}
                            className={`text-base text-left ${textColor}`}
                            >
                            {prefix}{item.label}
                            </button>
                        );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

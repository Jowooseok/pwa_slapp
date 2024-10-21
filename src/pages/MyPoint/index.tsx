import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';

const MyPoint: React.FC = () => {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState<'all' | 'earned' | 'used'>('all');

    // 하드코딩된 포인트 내역 데이터
    const pointHistory = [
        { id: 1, description: 'Join Telegram', date: '17-10-2024', points: +150, type: 'earned' },
        { id: 2, description: 'AI Dental Examination', date: '17-10-2024', points: -150, type: 'used' },
        { id: 3, description: 'Subscribe to Email', date: '17-10-2024', points: +150, type: 'earned' },
        { id: 4, description: 'AI Dental Examination', date: '17-10-2024', points: -150, type: 'used' },
    ];

    const filteredHistory = pointHistory.filter(
        (record) => selectedTab === 'all' || record.type === selectedTab
    );

    return (
        <div className="flex flex-col items-center text-white mx-6 md:mx-28">
            {/* 헤더 영역 */}
            <div className="flex items-center w-full mt-4 relative">
                {/* 뒤로가기 버튼 */}
                <FaChevronLeft 
                    className="text-2xl cursor-pointer absolute left-0"
                    onClick={() => navigate(-1)}
                    />
                <h1 className="text-2xl mx-auto font-semibold">My Point</h1>
            </div>

            {/* 소유 포인트 표시 영역 */}
            <div className="w-full max-w-md mt-8 p-6 bg-gray-800 rounded-2xl text-center">
                <p className="text-sm mb-2 text-gray-400">Available Points</p>
                <p className="text-4xl font-bold">10,000 P</p>
                <button 
                    className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full"
                    onClick={() => alert('Charging functionality coming soon!')}
                    >
                    Charging
                </button>
            </div>

            {/* 탭 영역: 왼쪽 정렬 */}
            <div className="flex w-full max-w-md mt-6 border-b border-gray-600">
                <div className="flex space-x-4">
                    <button
                        className={`pb-2 ${selectedTab === 'all' ? 'border-b-2 border-white' : ''}`}
                        onClick={() => setSelectedTab('all')}
                        >
                        All
                    </button>
                    <button
                        className={`pb-2 ${selectedTab === 'earned' ? 'border-b-2 border-white' : ''}`}
                        onClick={() => setSelectedTab('earned')}
                        >
                        Earned
                    </button>
                    <button
                        className={`pb-2 ${selectedTab === 'used' ? 'border-b-2 border-white' : ''}`}
                        onClick={() => setSelectedTab('used')}
                        >
                        Used
                    </button>
                </div>
            </div>

            {/* 포인트 내역 리스트 */}
            <div className="w-full max-w-md mt-4">
                {filteredHistory.map((record) => (
                    <div key={record.id} className="flex justify-between items-center py-4 border-b border-gray-700">
                        <div>
                            <p className="font-semibold">{record.description}</p>
                            <p className="text-sm text-gray-400">{record.date}</p>
                        </div>
                        <p className={`font-semibold ${record.points > 0 ? 'text-blue-400' : 'text-red-400'}`}>
                            {record.points > 0 ? `+${record.points}` : record.points}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyPoint;

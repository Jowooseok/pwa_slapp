import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronDown } from 'react-icons/fa';

const DiagnosisRecords: React.FC = () => {
    const [selectedFilter, setSelectedFilter] = useState('All');
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // 하드코딩된 진단 기록 데이터
    const records = [
        { date: '2024-10-07', type: 'Dental Checkup', result: 'Normal' },
        { date: '2024-09-07', type: 'Dental Checkup', result: 'Periodontitis Detection' },
        { date: '2024-08-15', type: 'Dental Checkup', result: 'Gingivitis & Plaque' },
        { date: '2024-07-12', type: 'Dental Checkup', result: 'Healthy' },
    ];

    // 필터링된 진단 기록
    const filteredRecords = records
        .filter((record) => selectedFilter === 'All' || record.result.includes(selectedFilter))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // 최신 날짜순 정렬

    return (
        <div className="flex flex-col items-center text-white mx-6 md:mx-28">
            <div className="flex items-center w-full mt-4 relative">
                {/* 뒤로가기 버튼 */}
                <FaChevronLeft className="text-2xl cursor-pointer absolute left-0" />
                <h1 className="text-2xl mx-auto font-semibold">Records</h1>
            </div>

            {/* 필터링 버튼 */}
            <div className="flex justify-start w-full mt-8 h-11 relative">
                <div className="relative w-auto max-w-xs">
                    <select
                        className="text-black p-2 rounded-full bg-white pr-6 pl-6 appearance-none w-full"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        <option value="All">All Records</option>
                        <option value="Normal">Normal</option>
                        <option value="Gingivitis & Plaque">Gingivitis & Plaque</option>
                        <option value="Periodontitis">Periodontitis</option>
                        <option value="Healthy">Healthy</option>
                    </select>
                    <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black pointer-events-none" />
                </div>
            </div>


            {/* 진단 기록 리스트 */}
            <div className="w-full max-w-2xl mt-8">
                {filteredRecords.map((record, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center">
                    <div>
                        <p className="font-semibold">{`${record.date} ${record.type}`}</p>
                        <p className="text-sm text-gray-400">{record.result}</p>
                    </div>
                    <FaChevronLeft className="text-lg cursor-pointer transform rotate-180" />
                </div>
                ))}
            </div>
        </div>
    );
};

export default DiagnosisRecords;
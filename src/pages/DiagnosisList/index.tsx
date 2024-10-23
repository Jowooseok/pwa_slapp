import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronDown } from 'react-icons/fa';
import getRecords from '@/entities/AI/api/getRecord';
import getDiagnosisList from '@/entities/Pet/api/getDiagnosisList';

const DiagnosisRecords: React.FC = () => {
    const [selectedFilter, setSelectedFilter] = useState<string>('All');
    const [filterOptions, setFilterOptions] = useState<string[]>(['All']);
    const [records, setRecords] = useState<{ diagnosisAt: string, result: string, diagnosisImgUrl: string, petName: string, petImgUrl: string }[]>([]);

    const location = useLocation();
    const navigate = useNavigate();
    
    const petData = location.state as { id: string };
    const [id] = useState<string>(petData?.id || '');

    // 페이지 최초 로드시 모든 기록 조회
    useEffect(() => {
        const fetchAllRecords = async () => {
            try {
                const allRecords = await getDiagnosisList(null, null, id);
                if (allRecords && Array.isArray(allRecords)) {
                    setRecords(allRecords);
                } else {
                    setRecords([]);
                }
            } catch (error) {
                console.error('Failed to fetch records:', error);
                alert('Failed to load records. Please try again later.');
            }
        };

        const fetchFilterOptions = async () => {
            try {
                const filters = await getRecords();
                if (filters && Array.isArray(filters)) {
                    setFilterOptions(['All', ...filters]);
                } else {
                    console.warn("Received unexpected filter options format:", filters);
                    setFilterOptions(['All']); // 기본 옵션으로 설정
                }
            } catch (error) {
                console.error('Failed to fetch filter options:', error);
                alert('Failed to load filter options. Please try again later.');
            }
        };

        fetchAllRecords();
        fetchFilterOptions();
    }, [id]);

    // 필터 변경 시 기록 조회
    useEffect(() => {
        const fetchFilteredRecords = async () => {
            if (id) {
                try {
                    const type = selectedFilter === 'All' ? null : selectedFilter;
                    const filteredRecords = await getDiagnosisList(type, null, id);
                    if (filteredRecords && Array.isArray(filteredRecords)) {
                        setRecords(filteredRecords);
                    } else {
                        setRecords([]); // 빈 배열로 설정하여 오류 방지
                    }
                } catch (error) {
                    console.error('Failed to fetch filtered records:', error);
                    alert('Failed to load records. Please try again later.');
                }
            }
        };

        fetchFilteredRecords();
    }, [selectedFilter, id]);

    return (
        <div className="flex flex-col items-center text-white mx-6 md:mx-28">
            <div className="flex items-center w-full mt-4 relative">
                {/* 뒤로가기 버튼 */}
                <FaChevronLeft className="text-2xl cursor-pointer absolute left-0" onClick={() => navigate(-1)} />
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
                        {/* {filterOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))} */}
                    </select>
                    <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black pointer-events-none" />
                </div>
            </div>

            {/* 진단 기록 리스트 */}
            <div className="w-full max-w-2xl mt-8">
                {records.map((record, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{`${record.diagnosisAt} ${record.result}`}</p>
                            <img src={record.diagnosisImgUrl} alt={record.result} className="w-20 h-20 mt-2 rounded-md" />
                            <p className="text-sm text-gray-400">{record.petName}</p>
                        </div>
                        <FaChevronLeft className="text-lg cursor-pointer transform rotate-180" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiagnosisRecords;

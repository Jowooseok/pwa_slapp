import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronDown } from 'react-icons/fa';
import getRecords from '@/entities/AI/api/getRecord';
import getDiagnosisList from '@/entities/Pet/api/getDiagnosisList';

const DiagnosisRecords: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string>('All');
    const [filterOptions, setFilterOptions] = useState<string[]>(['All']);
    const [records, setRecords] = useState<{ diagnosisAt: string, result: string, diagnosisImgUrl: string, petName: string, petImgUrl: string, type: string }[]>([]);

    const location = useLocation();
    const navigate = useNavigate();

    const petData = location.state as { id: string };
    const [id] = useState<string>(petData?.id || '');

    // 페이지 최초 로드시 모든 기록 조회
    useEffect(() => {
        const fetchAllRecords = async () => {
            setLoading(true);
            try {
                const allRecords = await getDiagnosisList(null, null, id, navigate);
                if (allRecords && Array.isArray(allRecords)) {
                    setRecords(allRecords);
                } else {
                    setRecords([]);
                }
            } catch (error) {
                console.error('Failed to fetch records:', error);
                alert('Failed to load records. Please try again later.');
            } finally {
                setLoading(false); // 로딩 상태 비활성화
            }
        };

        const fetchFilterOptions = async () => {
            try {
                const filters = await getRecords(navigate);
                if (filters && Array.isArray(filters)) {
                    // 필터 데이터에서 `record` 속성만을 추출하여 문자열 배열로 변환하고, 중복 제거
                    const filterLabels = [...new Set(filters.map((filter) => filter.record))];
                    setFilterOptions(['All', ...filterLabels]);
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
            setLoading(true);
            if (id) {
                try {
                    const record = selectedFilter === 'All' ? null : selectedFilter;
                    const filteredRecords = await getDiagnosisList(null, record, id, navigate);
                    if (filteredRecords && Array.isArray(filteredRecords)) {
                        setRecords(filteredRecords);
                    } else {
                        setRecords([]); // 빈 배열로 설정하여 오류 방지
                    }
                } catch (error) {
                    console.error('Failed to fetch filtered records:', error);
                    alert('Failed to load records. Please try again later.');
                } finally {
                    setLoading(false); // 로딩 상태 비활성화
                }
            }
        };

        fetchFilteredRecords();
    }, [selectedFilter, id]);

    // 글자수를 17글자로 제한하고 넘으면 "..." 붙이기
    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <div className="flex flex-col items-center text-white md:mx-14 w-full min-h-screen">
            <div className="flex items-center w-full mt-4 relative px-4"> 
                {/* 뒤로가기 버튼 */}
                <FaChevronLeft
                    className="text-2xl cursor-pointer absolute left-0"
                    onClick={() => navigate('/select-pet')}
                />
                <h1 className="text-2xl mx-auto font-semibold">Records</h1>
            </div>

            {/* 필터링 버튼 */}
            <div className="flex justify-start w-full mt-8 h-11 relative">
                <div className="relative w-1/2 max-w-xs"> {/* 너비를 절반으로 조정 */}
                    <select
                        className="text-black p-2 rounded-full bg-white pr-6 pl-6 appearance-none w-full"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        {filterOptions.map((option, index) => (
                            <option key={index} value={option}>
                                {truncateText(option, 17)} {/* 옵션 글자수 제한 */}
                            </option>
                        ))}
                    </select>
                    <FaChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black pointer-events-none" />
                </div>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center h-64 min-h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
                </div>
            ) : (
                <div className="w-full mt-8">
                    {records.map((record, index) => (
                        <div 
                            key={index} className="bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center"
                            onClick={() => navigate('/diagnosis-detail', { state: { img: record.diagnosisImgUrl, result: record.result } })}>
                            <div>
                                <p className="font-semibold">{`${record.diagnosisAt}  ${record.type}`}</p>
                                <p className="text-sm text-gray-400">{record.result}</p>
                            </div>
                            <FaChevronLeft className="text-lg cursor-pointer transform rotate-180" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DiagnosisRecords;

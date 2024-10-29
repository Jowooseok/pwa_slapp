import React, { useState, useEffect } from 'react';
import { FaPen, FaChevronLeft } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import useMainPageStore from '@/shared/store/useMainPageStore';
import getPetList from '@/entities/Pet/api/getPetList';

const SelectPet: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [pets, setPets] = useState<any[]>([]);
    const [modalMessage, setModalMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { selectedMenu } = useMainPageStore();

    // 사용자의 반려동물 조회
    useEffect(() => {
        const fetchPets = async () => {
            setLoading(true);
            try {
                const petList = await getPetList(navigate);
                setPets(petList);
            } catch (error) {
                console.error('Failed to fetch pets:', error);
                setModalMessage('Failed to load pets information. Please try again later.');
                setShowModal(true);
            } finally {
                setLoading(false); // 로딩 상태 비활성화
            }
        };

        fetchPets();
    }, []);

    useEffect(() => {
        if (location.state) {
            const { name, imageUrl } = location.state as { name: string; imageUrl: string };
            const newPet = { petId: `temp-${Date.now()}`, name, imageUrl };
            setPets((prevPets) => [...prevPets, newPet]);
        }
    }, [location.state]);

    // 반려동물 선택 시 페이지 이동 함수
    const handlePetSelect = (petId: number) => {
        if (selectedMenu === 'x-ray') {
            navigate(`/ai-xray-analysis`, {state: {id: petId}});
        } else if (selectedMenu === 'ai-analysis') {
            navigate(`/ai-dental-examination`, {state: {id: petId}});
        } else if (selectedMenu === 'records') {
            navigate(`/diagnosis-list`, {state: {id: petId}});
        }
    };

    return (
        <div className="flex flex-col items-center text-white mx-6 md:mx-28">
            <div className="flex items-center w-full mt-4 relative">
                {/* 뒤로가기 버튼 */}
                <FaChevronLeft
                    className="text-2xl cursor-pointer absolute left-0"
                    onClick={() => navigate('/home')}
                />
                <h1 className="text-2xl mx-auto font-semibold">Select Pet</h1>
            </div>

            {/* 로딩 중일 때 로딩 스피너 표시 */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
                </div>
            ) : (
                <div className="grid grid-cols-2 mt-11 w-full max-w-md">
                    {/* 반려동물 목록 */}
                    {pets.map((pet) => (
                        <div key={pet.petId} className="w-full max-w-[180px] flex flex-col items-center">
                            <div className="relative w-full h-full rounded-lg bg-[#0D1226] flex items-center justify-center overflow-hidden">
                                <img
                                    src={pet.imageUrl}
                                    alt={pet.name}
                                    className="w-[130px] h-[130px] md:w-[150px] md:h-[150px] lg:w-[180px] lg:h-[180px] object-cover rounded-2xl"
                                    onClick={() => handlePetSelect(pet.petId)}
                                />
                                <button
                                    className="absolute bottom-2 right-8 bg-blue-500 p-1 rounded-full cursor-pointer"
                                    onClick={() =>
                                        navigate(`/edit-pet`, {
                                            state: { id: pet.petId, name: pet.name, imageUrl: pet.imageUrl },
                                        })
                                    }
                                >
                                    <FaPen className="text-white" />
                                </button>
                            </div>
                            <div className="mt-2 mb-6 text-center font-semibold text-lg w-full">
                                {pet.name}
                            </div>
                        </div>
                    ))}

                    {/* 반려동물 추가 버튼 */}
                    <div key="add-pet" className="flex flex-col items-center">
                        <div className="w-[130px] h-[130px] md:w-[150px] md:h-[150px] lg:w-[180px] lg:h-[180px] rounded-lg bg-gray-800 flex items-center justify-center cursor-pointer">
                            <button
                                className="text-white text-5xl"
                                onClick={() => navigate('/regist-pet')}
                            >
                                +
                            </button>
                        </div>
                        <div className="mt-2 text-center font-semibold text-lg">Add Profile</div>
                    </div>
                </div>
            )}


            
            {/* 모달창 */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white text-black p-6 rounded-lg text-center">
                        <p>{modalMessage}</p>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
                            onClick={() => setShowModal(false)}
                            >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectPet;

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPen, FaPaw } from "react-icons/fa";
import updatePetInfo from '@/entities/Pet/api/updatePetInfo'; // 반려동물 정보 업데이트 API 함수
import deletePet from '@/entities/Pet/api/deletePetInfo';

const EditPet: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const petData = location.state as { id: string, name: string, imageUrl: string };
    
    const [petImage, setPetImage] = useState<File | null>(null);
    const [petImageUrl, setPetImageUrl] = useState<string | null>(petData?.imageUrl || null);
    const [petName, setPetName] = useState<string>(petData?.name || '');
    const [id] = useState<string>(petData?.id || '');

    // 이미지 수정
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            setPetImage(selectedFile);
            setPetImageUrl(URL.createObjectURL(selectedFile));
        }
    };

    // 완료 버튼 클릭 (반려동물 정보 수정)
    const editBtn = async () => {        
        if (!petName) {
            alert('Please provide the pet name.');
            return;
        }

        try {
            // FormData 생성
            const formData = new FormData();
            formData.append('json', new Blob([JSON.stringify({ name: petName, petId: id })], { type: "application/json" }));
            
            // 이미지가 선택된 경우에는 이미지를 추가하고, 선택되지 않은 경우에는 null 값을 추가
            if (petImage) {
                formData.append('file', petImage);
            } else {
                // 빈 파일 생성
                const emptyFile = new File([""], "empty.txt", { type: "text/plain" });
                formData.append('file', emptyFile);
            }

            await updatePetInfo(formData);
            alert('Pet updated successfully!');
            navigate('/select-pet');
        } catch (error) {
            alert('Failed to update pet. Please try again.');
        }
    };

    // 삭제 버튼 클릭 (반려동물 삭제)
    const deleteBtn = async () => {
        if (id) {
            if (window.confirm("정말로 반려동물을 삭제하시겠습니까?")) {
                try {
                    await deletePet(id);
                    alert("반려동물이 삭제되었습니다.");
                    navigate('/select-pet');
                } catch (error) {
                    console.error("Failed to delete pet:", error);
                    alert("Failed to delete pet. Please try again.");
                }
            }
        }
    };

    return (
        <div className="flex flex-col items-center text-white mx-6 md:mx-28 max-w-screen-xl relative min-h-screen pb-20">
            <div className="flex items-center w-full mt-[45px] relative">
                <h1 className="text-2xl mx-auto font-semibold">Edit Pet</h1>
            </div>
      
            {/* 반려동물 이미지 업로드 */}
            <div className="mt-10 relative">
                <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
                    {petImageUrl ? (
                        <img
                            src={petImageUrl}
                            alt="Pet"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <FaPaw className="text-6xl text-gray-600" />
                    )}
                </div>
                <label htmlFor="pet-image-upload" className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer">
                    <FaPen className="text-white" />
                </label>
                <input
                    id="pet-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
            </div>
      
            {/* 반려동물 이름 입력란 */}
            <div className="mt-16 w-11/12 max-w-md">
                <input
                    type="text"
                    placeholder="Please enter name"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="w-full p-4 rounded-md mb-4 bg-gray-900 text-white border border-[#35383F] focus:outline-none"
                />
            </div>

            {/* 삭제 및 수정 버튼을 하단에 고정 */}
            <div className="w-full max-w-md absolute bottom-16 left-1/2 transform -translate-x-1/2 flex justify-between gap-4">
                <button
                    className="w-1/2 py-4 rounded-full text-lg font-semibold text-[#DD2726] border-4"
                    style={{ backgroundColor: "#0D1226", borderColor:"#DD2726" }}
                    onClick={deleteBtn}
                >
                    Delete
                </button>
                <button
                    className="w-1/2 py-4 rounded-full text-lg font-semibold"
                    style={{ backgroundColor: "#0147E5" }}
                    onClick={editBtn}
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default EditPet;
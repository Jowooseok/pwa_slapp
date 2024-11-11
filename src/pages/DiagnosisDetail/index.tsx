import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Images from "@/shared/assets/images";

const DiagnosisDetail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const resultData = location.state as { img: string, result: string };
    const [label] = useState<string>(resultData?.result || ''); // 진단명
    const [imageUrl] = useState<string>(resultData?.img || ''); // 진단 이미지
    const [showFullText, setShowFullText] = useState(false);


    // 진단 가능한 항목에 대한 설명
    const symptomsInfo: Record<string, string> = {
        "Gingivitis & Plaque": "Symptoms of gingivitis and plaque have been detected in your dog. It is important to visit the vet as soon as possible to address this condition. Maintaining good oral hygiene is crucial for your pet's health.",
        "Periodontitis": "Symptoms of periodontitis have been detected in your dog. This condition can cause discomfort and pain. We recommend seeing a veterinarian promptly for proper diagnosis and treatment.",
        "Decrease in dental bone density": "A decrease in dental bone density has been detected in your dog's X-ray. This could indicate bone loss, which may require veterinary attention. Regular check-ups and appropriate dental care are recommended.",
        "Fractured tooth": "Symptoms of a fractured tooth have been detected in your dog. It is important to visit the vet as soon as possible to address this condition. Fractured teeth can cause discomfort and lead to other oral health issues.",
        "Gingivitis": "Symptoms of gingivitis have been detected in your dog. Gingivitis can lead to more severe dental issues if untreated. It is recommended to see a veterinarian to discuss a treatment plan.",
        "Healthy": "No issues were detected in your dog's teeth. Your dog's dental health appears to be good. Keep maintaining regular oral hygiene to ensure their continued health."
    };

    return (
        <div className="flex flex-col items-center text-white mx-6 md:mx-28  min-h-screen">
            <div className="flex items-center w-full mt-4 relative">
                <img
                    src={Images.goback}
                    alt="Go Back"
                    className="w-8 h-8 cursor-pointer absolute left-0"
                    onClick={() => navigate(-1)}
                />
                <h1 className="text-2xl mx-auto font-semibold">Record Details</h1>
            </div>

            {/* 이미지 표시 영역 */}
            <div className="mt-6 w-full max-w-sm lg:max-w-md mx-auto rounded-2xl overflow-hidden p-2 flex flex-col items-center">
                <div className="w-[240px] h-[240px] md:w-[400px] md:h-[400px] lg:w-[400px] lg:h-[400px] bg-gray-600 rounded-2xl flex items-center justify-center">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Diagnosis Result"
                            className="w-full h-full object-cover rounded-2xl"
                        />
                    ) : (
                        <div className="text-lg">Loading image...</div>
                    )}
                </div>
            </div>

            <div className="w-full">
                <div id="label-container" className="mt-4 text-lg md:text-xl lg:text-2xl font-semibold">
                    <p>Analysis results: {label}</p>
                </div>

                <div className="mt-4 p-4 bg-gray-800 text-white rounded-xl shadow-md max-w-2xl lg:max-w-3xl mx-auto">
                    <p
                        className="overflow-hidden text-sm md:text-base lg:text-lg"
                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: showFullText ? undefined : 3,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {symptomsInfo[label] || 'Diagnosis information not available.'}
                    </p>
                    <div className="flex justify-center mt-2">
                        {!showFullText && (
                            <button
                                className="mt-2 w-1/2 text-black text-base md:text-lg lg:text-xl font-semibold py-2 px-4 rounded-xl"
                                style={{ backgroundColor: "#FFFFFF" }}
                                onClick={() => setShowFullText(true)}
                            >
                                See more
                            </button>
                        )}
                        {showFullText && (
                            <button
                                className="mt-2 w-1/2 text-black text-base md:text-lg lg:text-xl font-semibold py-2 px-4 rounded-xl"
                                style={{ backgroundColor: "#FFFFFF" }}
                                onClick={() => setShowFullText(false)}
                            >
                                See less
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="w-11/12 max-w-md absolute bottom-16 left-1/2 transform -translate-x-1/2">
                <button
                    className="w-full py-4 rounded-full text-lg font-semibold"
                    style={{backgroundColor: '#0147E5'}}
                    onClick={() => navigate('/home')}
                    >
                    Home
                </button>
            </div>
        </div>
    );
};

export default DiagnosisDetail;

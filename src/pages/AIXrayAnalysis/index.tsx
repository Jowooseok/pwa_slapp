import React, { useState } from 'react';
import * as tmImage from '@teachablemachine/image';
import { FaChevronLeft } from "react-icons/fa";
import Images from "@/shared/assets/images";
import { useNavigate, useLocation } from 'react-router-dom';
import storeResult from '@/entities/AI/api/stroeResult';

const AIXrayAnalysis: React.FC = () => {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [label, setLabel] = useState("Upload an X-ray image to start analysis.");
  const [loading, setLoading] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const petData = location.state as { id: string };
  const [id] = useState<string>(petData?.id || '');

  // 진단 가능한 항목에 대한 설명
  const symptomsInfo: Record<string, string> = {
    "Decrease in dental bone density": "A decrease in dental bone density has been detected in your dog's X-ray. This could indicate bone loss, which may require veterinary attention. Regular check-ups and appropriate dental care are recommended.",
    "Fractured tooth": "Symptoms of a fractured tooth have been detected in your dog. It is important to visit the vet as soon as possible to address this condition. Fractured teeth can cause discomfort and lead to other oral health issues.",
    "Gingivitis": "Symptoms of gingivitis have been detected in your dog. Gingivitis can lead to more severe dental issues if untreated. It is recommended to see a veterinarian to discuss a treatment plan.",
    "Periodontitis": "Symptoms of periodontitis have been detected in your dog. This condition can cause significant pain and tooth loss if not addressed promptly. Please consult your veterinarian for further care.",
    "Healthy": "No issues were detected in your dog's teeth. Your dog's dental health appears to be good. Keep maintaining regular oral hygiene to ensure their continued health."
  };

  // Teachable Machine 모델 로드 함수
  const loadModel = async () => {
    if (!model) {
      try {
        const modelURL = "/ai_model/xray/model.json";
        const metadataURL = "/ai_model/xray/metadata.json";
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);
        return loadedModel; // 모델 로드 후 반환
      } catch (error) {
        console.error("Failed to load model:", error);
        alert("Failed to load the AI model. Please try again later or check your network connection.");
      }
    }
    return model; // 이미 로드된 모델이 있으면 반환
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]);
      setLabel("Click the button to analyze the uploaded image.");
      setIsAnalyzed(false);
    }
  };

  // 이미지 분석 함수
  const analyzeImage = async () => {
    if (!selectedImage) {
      setShowModal(true); // 이미지를 업로드하지 않았을 때 모달 표시
      return;
    }

    setLoading(true);
    const loadedModel = await loadModel(); // 모델을 로드하고 가져옴

    if (loadedModel && selectedImage) {
      const imageElement = document.createElement('img');
      imageElement.src = window.URL.createObjectURL(selectedImage); // 파일에서 생성된 URL 사용
      imageElement.onload = async () => {
        const prediction = await loadedModel.predict(imageElement);
        const highestPrediction = prediction.reduce((prev, current) =>
          prev.probability > current.probability ? prev : current
        );

        setLabel(highestPrediction.className);
        setLoading(false);
        setIsAnalyzed(true);
      };
    } else {
      setLoading(false);
    }
  };

  // 서버에 저장하는 함수
  const saveResult = async () => {
    if (selectedImage && isAnalyzed) {
      try{
        const formData = new FormData();
        formData.append('json', new Blob([JSON.stringify({ petId: id, result: label })], { type: 'application/json' }));
        formData.append('file', selectedImage);

        const response = await storeResult(formData, "xray");
        
        if (response) {
          navigate('/diagnosis-list', { state: { id: id } });
          console.log("Result saved successfully.");
        } else {
          console.log("Failed to save result. Please try again.");
        }

      }catch(error: any){
        console.error("Error saving result:", error);
      }
    } else {
      alert("Please analyze the image before saving.");
    }
  };

  return (
    <div className="flex flex-col items-center text-white mx-6 md:mx-28">
      <div className="flex items-center w-full mt-4 relative">
          {/* 뒤로가기 버튼 */}
          <FaChevronLeft
              className="text-2xl cursor-pointer absolute left-0"
              onClick={() => navigate(-1)}
          />
          <h1 className="text-2xl mx-auto font-semibold">AI X-ray Analysis</h1>
      </div>

      <div className="mt-6 w-full max-w-sm mx-auto rounded-md overflow-hidden p-2 flex flex-col items-center">
        {/* 숨겨진 파일 업로드 인풋 */}
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"/>
        {/* 이미지 선택 전에는 업로드 버튼, 선택 후에는 업로드된 이미지 */}
        <label htmlFor="file-upload" className="cursor-pointer">
          {selectedImage ? (
            <img
              src={window.URL.createObjectURL(selectedImage)}
              alt="Uploaded X-ray"
              className="w-64 h-64 rounded-md object-fill"/>
          ) : (
            <img
              src={Images.uploader}
              alt="Click here to upload your image"
              className="w-64 h-64 object-cover"/>
          )}
        </label>
      </div>

      {/* 분석 버튼: 분석이 진행 중이거나 완료된 경우 숨김 */}
      {!isAnalyzed && (
        <div className="mt-6 w-full max-w-lg mx-auto rounded-md overflow-hidden">
          <button
            className={`w-full text-white text-lg py-2 px-4 rounded-full ${loading ? 'cursor-wait' : ''}`}
            style={{ backgroundColor: "#0147E5" }}
            onClick={analyzeImage}
            disabled={loading}>
            {loading ? "Analyzing..." : "Upload image and analysis"}
          </button>
        </div>
      )}

      {/* 분석 결과 표시 */}
      {isAnalyzed && (
        <>
          <div id="label-container" className="mt-4 text-lg font-semibold">
            <p>Analysis results: {label}</p>
          </div>

          <div className="mt-4 p-4 bg-gray-800 text-white rounded-xl shadow-md max-w-sm mx-auto">
            <p
              className="overflow-hidden text-sm"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: showFullText ? undefined : 3,
                WebkitBoxOrient: "vertical",
              }}>
              {symptomsInfo[label]}
            </p>
            <div className="flex justify-center mt-2">
              {!showFullText && (
                <button
                  className="mt-2 w-1/2 text-black text-base font-semibold py-2 px-4 rounded-xl"
                  style={{ backgroundColor: "#FFFFFF" }}
                  onClick={() => setShowFullText(true)}>
                  See more
                </button>
              )}
              {showFullText && (
                <button
                  className="mt-2 w-1/2 text-black text-base font-semibold py-2 px-4 rounded-xl"
                  style={{ backgroundColor: "#FFFFFF" }}
                  onClick={() => setShowFullText(false)}>
                  See less
                </button>
              )}
            </div>
          </div>

          {/* Retest 및 Save 버튼을 수평으로 배치 */}
          <div className="flex w-full max-w-sm justify-between mt-10 mb-16">
            <button
              className="w-[48%] h-14 text-white text-base py-2 px-4 rounded-full border-2"
              style={{ backgroundColor: "#252932", borderColor: "#35383F" }}
              onClick={() => window.location.reload()}>
              Retest
            </button>
            <button
              className="w-[48%] h-14 text-white text-base py-2 px-4 rounded-full"
              style={{ backgroundColor: "#0147E5" }}
              onClick={saveResult}>
              Save
            </button>
          </div>
        </>
      )}

      {/* 이미지 업로드 요청 모달 */}
      {showModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg text-black text-center">
            <p>Please upload an image before analysis.</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={() => setShowModal(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIXrayAnalysis;

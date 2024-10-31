import React, { useEffect, useRef, useState } from 'react';
import * as tmImage from '@teachablemachine/image';
import { useNavigate, useLocation } from 'react-router-dom';
import storeResult from '@/entities/AI/api/stroeResult';
import { FaChevronLeft } from "react-icons/fa";

const AIDentalExamination: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [label, setLabel] = useState("Normal");
  const [webcam, setWebcam] = useState<tmImage.Webcam | null>(null);
  const webcamRef = useRef<HTMLDivElement>(null);

  const [showFullText, setShowFullText] = useState(false);
  const [isDetectionStopped, setIsDetectionStopped] = useState(false);
  const [capturedImage, setCapturedImage] = useState<File | null>(null); // 캡처된 이미지 저장
  const [timerStarted, setTimerStarted] = useState(false); // 타이머 시작 여부 상태

  const petData = location.state as { id: string };
  const [id] = useState<string>(petData?.id || '');

  const symptomsInfo: Record<string, string> = {
    "Gingivitis & Plaque": "Symptoms of gingivitis and plaque have been detected in your dog. It is important to visit the vet as soon as possible to address this condition. Maintaining good oral hygiene is crucial for your pet's health.",
    "Periodontitis": "Symptoms of periodontitis have been detected in your dog. This condition can cause discomfort and pain. We recommend seeing a veterinarian promptly for proper diagnosis and treatment.",
    "Normal": "No issues were detected in your dog's teeth. Keep maintaining good dental hygiene to ensure their continued health."
  };

  useEffect(() => {
    const loadModelAndSetupWebcam = async () => {
      const modelURL = "/ai_model/dental/model.json";
      const metadataURL = "/ai_model/dental/metadata.json";

      try {
        // 모델 로드
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);
      } catch (error) {
        console.error("Error loading model:", error);
        alert("Failed to load the AI model. Please check your network connection or contact support.");
        return;
      }

      try {
        // 웹캠 설정
        const flip = false; // 웹캠 좌우 반전 여부
        const width = 240; // 너비 설정
        const height = 240; // 높이 설정

        // 장치 유형 감지: 모바일이면 후면 카메라, 노트북이면 기본 웹캠
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const facingMode = isMobile ? "environment" : "user";

        const newWebcam = new tmImage.Webcam(width, height, flip);

        // `setup` 메서드에 `facingMode` 설정 추가
        await newWebcam.setup({ facingMode: { ideal: facingMode } });

        // 비디오 요소에 속성 추가
        if (newWebcam.webcam) {
          newWebcam.webcam.setAttribute('playsinline', 'true');
          newWebcam.webcam.setAttribute('muted', 'true');
        }
        await newWebcam.play();
        setWebcam(newWebcam);

        if (webcamRef.current) {
          webcamRef.current.innerHTML = ""; // 기존 웹캠 캔버스를 지워 중복 방지
          webcamRef.current.appendChild(newWebcam.canvas);
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
        alert("Failed to access the camera. Please check your browser settings and allow camera access.");
      }
    };

    loadModelAndSetupWebcam();

    return () => {
      if (webcam) {
        webcam.stop();
      }
    };
  }, []); // 빈 의존성 배열로 한 번만 실행되도록 설정

  useEffect(() => {
    if (model && webcam) {
      const loop = async () => {
        if (webcam && model && !isDetectionStopped) {
          webcam.update(); // 웹캠 프레임 업데이트
          await predict(); // 예측 수행
          window.requestAnimationFrame(loop);
        }
      };
      loop();
    }
  }, [model, webcam, isDetectionStopped]);

  // 모델 예측 함수
  const predict = async () => {
    if (model && webcam) {
      const prediction = await model.predict(webcam.canvas);
      const highestPrediction = prediction.reduce((prev, current) =>
        prev.probability > current.probability ? prev : current
      );

      if (!timerStarted) {
        setTimerStarted(true);
        setTimeout(() => {
          if (highestPrediction.probability > 0.95 && !isDetectionStopped) {
            stopWebcam(highestPrediction.className);
          }
        }, 5000);
      }

      console.log("Current prediction:", highestPrediction.className, "Probability:", highestPrediction.probability);

      if (highestPrediction.probability <= 0.95) {
        setLabel("Normal");
      }
    }
  };

  // 웹캠 정지 및 이미지 캡처 함수
  const stopWebcam = (detectedLabel: string = "Normal") => {
    if (webcam && webcam.webcam) {
      const stream = webcam.webcam.srcObject as MediaStream | null;

      if (stream) {
        stream.getTracks().forEach((track) => {
          if (track.readyState === 'live') {
            track.stop();
          }
        });
      }

      if (webcam.webcam && webcam.webcam.srcObject) {
        webcam.stop();
        setIsDetectionStopped(true);
        setLabel(detectedLabel);

        webcam.canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], 'dental_capture.png', { type: 'image/png' });
            setCapturedImage(capturedFile); // 캡처된 이미지를 상태로 저장
          }
        }, 'image/png');
      }
    }
  };

  // 서버에 저장하는 함수
  const saveResult = async () => {
    if (capturedImage && isDetectionStopped) {
      try {
        const formData = new FormData();
        formData.append('json', new Blob([JSON.stringify({ petId: id, result: label })], { type: 'application/json' }));
        formData.append('file', capturedImage);

        const response = await storeResult(formData, "dental");
        if (response) {
          navigate('/diagnosis-list', { state: { id: id } });
          console.log("Result saved successfully.");
        } else {
          console.log("Failed to save result. Please try again.");
        }
      } catch (error: any) {
        console.error("Error saving result:", error);
      }
    } else {
      alert("Please complete the detection before saving.");
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

      <div
        ref={webcamRef}
        className="mt-6 w-60 h-60 flex justify-center items-center mx-auto rounded-md overflow-hidden border border-gray-300"
        style={{ width: "240px", height: "240px" }}>
        {/* 웹캠이 여기에 렌더링됩니다 */}
      </div>
      <div id="label-container" className="mt-4">
        <p className="text-lg font-semibold">Analysis results: {label}</p>
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
    </div>
  );
};

export default AIDentalExamination;

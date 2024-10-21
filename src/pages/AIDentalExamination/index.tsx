import React, { useEffect, useRef, useState } from 'react';
import * as tmImage from '@teachablemachine/image';
import Images from "@/shared/assets/images";
import { useNavigate, useParams } from 'react-router-dom';
import storeResult from '@/entities/AI/api/stroeResult';

const AIDentalExamination: React.FC = () => {
  const URL = "../../shared/ai_model/dental_examination/"; // Teachable Machine 모델 경로
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [label, setLabel] = useState("Normal");
  const [webcam, setWebcam] = useState<tmImage.Webcam | null>(null);
  const webcamRef = useRef<HTMLDivElement>(null);
  const [showFullText, setShowFullText] = useState(false);
  const [isDetectionStopped, setIsDetectionStopped] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const symptomsInfo: Record<string, string> = {
    "Gingivitis & Plaque": "Symptoms of gingivitis and plaque have been detected in your dog. It is important to visit the vet as soon as possible to address this condition. Maintaining good oral hygiene is crucial for your pet's health.",
    "Periodontitis": "Symptoms of periodontitis have been detected in your dog. This condition can cause discomfort and pain. We recommend seeing a veterinarian promptly for proper diagnosis and treatment.",
    "Normal": "No issues were detected in your dog's teeth. Keep maintaining good dental hygiene to ensure their continued health."
  };

  useEffect(() => {
    const loadModelAndSetupWebcam = async () => {
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      try {
        // 모델 로드
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);

        // 웹캠 설정
        const flip = true; // 웹캠 좌우 반전 여부
        const width = 240; // 너비 설정
        const height = 240; // 높이 설정

        const newWebcam = new tmImage.Webcam(width, height, flip);
        await newWebcam.setup(); // 웹캠 접근 요청
        await newWebcam.play();
        setWebcam(newWebcam);

        if (webcamRef.current) {
          webcamRef.current.innerHTML = ""; // 기존 웹캠 캔버스를 지워 중복 방지
          webcamRef.current.appendChild(newWebcam.canvas);
        }
      } catch (error) {
        console.error("Error loading model or accessing webcam:", error);
        alert("Failed to load the AI model or access the camera. Please check browser settings or try again.");
      }
    };

    loadModelAndSetupWebcam();

    return () => {
      // 컴포넌트가 언마운트될 때 웹캠을 정지하여 리소스 해제
      if (webcam) {
        // stopWebcam();
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
  }, [model, webcam, isDetectionStopped]); // model, webcam, isDetectionStopped 상태가 변경될 때 실행되도록 설정

  // 모델 예측 함수
  const predict = async () => {
    if (model && webcam) {
      const prediction = await model.predict(webcam.canvas);
      const highestPrediction = prediction.reduce((prev, current) =>
        prev.probability > current.probability ? prev : current
      );

      if (highestPrediction.probability > 0.8 && highestPrediction.className !== "Normal") {
        // 웹캠을 멈추고 최종 레이블을 업데이트합니다.
        // stopWebcam(highestPrediction.className);
      } else {
        setLabel("Normal");
      }
    }
  };

  // 웹캠 정지 함수
  const stopWebcam = (detectedLabel: string = "Normal") => {
    if (webcam && webcam.webcam) {
      const stream = webcam.webcam.srcObject as MediaStream | null;

      // 스트림이 존재하는지 안전하게 확인 후 트랙 정지
      if (stream) {
        stream.getTracks().forEach((track) => {
          if (track.readyState === 'live') {
            track.stop(); // 모든 트랙 정지
          }
        });
      }

      // 웹캠의 stop 메서드를 호출하기 전에 상태를 안전하게 확인
      if (webcam.webcam && webcam.webcam.srcObject) {
        webcam.stop(); // Teachable Machine 웹캠 멈추기
        setIsDetectionStopped(true);

        // 현재 날짜 가져오기
        const currentDate = new Date().toLocaleString();
        
        // 진단 결과 라벨을 최신으로 설정
        setLabel(detectedLabel);

        // 이미지 캡처: Blob 형태로 변환 후 File 객체 생성
        webcam.canvas.toBlob((blob) => {
          if (blob) {
            const capturedImage = new File([blob], 'dental_capture.png', { type: 'image/png' });

            // 콘솔 로그로 이미지, 날짜, 라벨 출력
            console.log("Captured Image:", capturedImage);
            console.log("Detected Label:", detectedLabel);
            console.log("Date:", currentDate);

            // 서버에 저장 요청
            storeResult(capturedImage, currentDate, detectedLabel, "dental");
          }
        }, 'image/png');
      }
    }
  };

  // 서버에 저장하는 함수
  const saveResult = async () => {
    if (webcam && isDetectionStopped) {
      const currentDate = new Date().toLocaleString();
      webcam.canvas.toBlob((blob) => {
        if (blob) {
          const capturedImage = new File([blob], 'dental_capture.png', { type: 'image/png' });
          storeResult(capturedImage, currentDate, label, "dental");
          console.log("Result saved successfully.");
        }
      }, 'image/png');
    } else {
      alert("Please complete the detection before saving.");
    }
  };

  return (
    <div className="flex flex-col items-center text-white mx-6 md:mx-28">
      <div className="flex items-center w-full mt-4 relative">
        {/* 뒤로가기 버튼 추가 */}
        <img
          src={Images.goback} // 뒤로가기 이미지 경로
          alt="Go Back"
          className="w-8 h-8 cursor-pointer absolute left-0"
          onClick={() => navigate(-1)} // 뒤로가기 기능
        />
        <h1 className="text-2xl mx-auto">AI Dental Examination</h1>
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

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSignupStore from '@/shared/store/SignupState';
import sendVerificationCode from '@/entities/User/api/sendCode';
import verifyEmailCode from '@/entities/User/api/verifyCode';
import { FaChevronLeft } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';

const SignupEmail: React.FC = () => {
    const { email, setEmail } = useSignupStore();
    const [verificationCode, setVerificationCode] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [timer, setTimer] = useState(300); // 5분 타이머 (초 단위)
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [showModal, setShowModal] = useState<{ message: string; onConfirm: () => void } | null>(null);
    const navigate = useNavigate();
  
    // 이메일 인증 코드 발송 변이 훅
    const { mutate: sendCodeMutate, isPending: isSendingCode } = useMutation<void, Error, string>({
      mutationFn: sendVerificationCode,
      onSuccess: () => {
        setIsEmailSent(true);
        startTimer();
        setEmail(email);
        setShowModal({
          message: '인증 코드가 전송되었습니다.',
          onConfirm: () => setShowModal(null),
        });
      },
      onError: (error: any) => {
        setShowModal({
          message: error.message || '인증 코드 전송 중 오류 발생. 다시 시도해주세요.',
          onConfirm: () => setShowModal(null),
        });
      },
    });
  
    // 이메일 인증 코드 검증 변이 훅
    const { mutate: verifyCodeMutate, isPending: isVerifyingCode } = useMutation<void, Error, { email: string; verificationCode: string }>({
      mutationFn: verifyEmailCode,
      onSuccess: () => {
        setShowModal({
          message: '인증에 성공했습니다.',
          onConfirm: () => navigate('/signup-password'),
        });
      },
      onError: (error: any) => {
        setShowModal({
          message: error.message || '코드를 확인해 주세요.',
          onConfirm: () => setShowModal(null),
        });
      },
    });
  
    // 이메일 인증 번호 요청 함수
    const handleSendEmail = () => {
      if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
      }
  
      sendCodeMutate(email);
    };
  
    // 인증 코드 확인 함수
    const handleVerifyCode = () => {
      if (verificationCode === '') {
        alert('Please enter the verification code');
        return;
      }
  
      verifyCodeMutate({ email, verificationCode });
    };

  // 이메일 형식 유효성 검사 함수
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // 타이머 시작 함수
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(300);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsEmailSent(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 남은 시간 표시 형식
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center text-white mx-6 md:mx-28">
      <div className="flex items-center w-full mt-4 relative">
        {/* 뒤로가기 버튼 */}
        <FaChevronLeft
          className="text-2xl cursor-pointer absolute left-0"
          onClick={() => navigate('/login')}
        />
        <h1 className="text-2xl mx-auto font-semibold">Signup</h1>
      </div>

      <div className="w-full max-w-sm mt-10">
        <label className="text-sm mb-2 block text-[#A3A3A3]">Email Verification</label>
        <div className="flex gap-2 mb-4">
          <input
            type="email"
            placeholder="Please enter your E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 p-4 rounded-xl bg-gray-900 text-white border border-[#35383F] focus:outline-none text-xs"
          />
          <button
            className="text-white h-14 py-2 px-4 rounded-2xl"
            style={{ backgroundColor: '#0147E5' }}
            onClick={handleSendEmail}
            disabled={isEmailSent || isSendingCode}
          >
            {isSendingCode ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      {isEmailSent && (
        <div className="w-full max-w-sm">
          <p className="text-xs mb-2 text-[#D4D4D4]">
            We've sent you a verification email, please check your email
          </p>
          <div className="flex items-center mb-4 relative">
            <input
              type="text"
              placeholder="Please enter the verification number"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full p-4 pr-16 rounded-xl bg-gray-900 text-white border border-[#35383F] focus:outline-none text-xs"
            />
            <span className="absolute right-4 text-[#0147E5]">{formatTime(timer)}</span>
          </div>
          <button
            className="text-[#D4D4D4] mb-6 text-xs"
            onClick={handleSendEmail}
            disabled={isSendingCode}
          >
            Resend Email
          </button>
        </div>
      )}

      <div className="w-full max-w-sm">
        <button
          className="w-full h-14 text-white text-lg py-2 px-4 rounded-full"
          style={{ backgroundColor: '#0147E5' }}
          onClick={handleVerifyCode}
          disabled={isVerifyingCode}
        >
          {isVerifyingCode ? 'Verifying...' : 'Confirm'}
        </button>
      </div>

      {/* 모달창 */}
      {showModal && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg text-black text-center">
            <p>{showModal.message}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={showModal.onConfirm}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupEmail;

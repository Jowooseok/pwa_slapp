import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSignupStore from '@/shared/store/SignupState';
import sendVerificationCode from '@/entities/User/api/sendCode';
import verifyEmailCode from '@/entities/User/api/verifyCode';
import updatePasseword from '@/entities/User/api/updatePassword';

const FindPassword: React.FC = () => {
    const { email, setEmail } = useSignupStore();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(true);
    const [timer, setTimer] = useState(300); // 5분 타이머 (초 단위)
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [showModal, setShowModal] = useState<{ message: string; onConfirm: () => void } | null>(null);
    const [checked, setChecked] = useState(true);
    const navigate = useNavigate();

    // 이메일 인증 번호 요청 함수
    const handleSendEmail = async () => {
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        try {
            await sendVerificationCode(email);
            setIsEmailSent(true);
            startTimer();
            setEmail(email);
            console.log('Email saved to store:', email);
        } catch (error) {
            alert('Failed to send verification code. Please try again.');
        }
    };

    // 인증 코드 확인 함수
    // const handleVerifyCode = async () => {
    //     if (verificationCode === '') {
    //         setShowModal({
    //             message: '코드를 확인해 주세요.',
    //             onConfirm: () => setShowModal(null),
    //         });
    //         return;
    //     }

    //     try {
    //         const result = await verifyEmailCode(email, verificationCode);
    //         if (result) {
    //             // 인증 성공 시 모달창 표시
    //             setShowModal({
    //                 message: '인증에 성공했습니다.',
    //                 onConfirm: () => setShowModal(null),
    //             });
    //         } else {
    //             // 인증 실패 시 모달창 표시
    //             setShowModal({
    //                 message: '코드를 확인해 주세요.',
    //                 onConfirm: () => setShowModal(null),
    //             });
    //         }
    //     } catch (error) {
    //         setShowModal({
    //             message: '코드를 확인해 주세요.',
    //             onConfirm: () => setShowModal(null),
    //         });
    //     }
    // };

    // 비밀번호 변경 클릭 핸들러
    const handleChangePw = async () => {
        console.log("Change PW clicked.");
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
                <h1 className="text-2xl mx-auto font-semibold">Find My Password</h1>
            </div>

            
            <div className="w-full max-w-sm mt-10">
                <label className="text-sm mb-2 block text-[#A3A3A3]">Enter Email</label>
                <div className="flex gap-2 mb-4">
                    {/* 이메일 입력 */}
                    <input
                        type="email"
                        placeholder="Please enter your E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-14 p-4 rounded-xl bg-gray-900 text-white border border-[#35383F] focus:outline-none text-xs"
                    />
                    {/* 인증코드 전송 버튼*/}
                    <button
                        className="text-white h-14 py-2 px-4 rounded-2xl"
                        style={{ backgroundColor: "#0147E5", cursor: email ? 'pointer' : 'not-allowed', opacity: email ? 1 : 0.5 }}
                        onClick={handleSendEmail}
                        disabled={isEmailSent || !email}
                        >
                        Send
                    </button>
                </div>
            </div>

            {/* 이메일 인증코드 입력란 */}
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
                    <button className="text-[#D4D4D4] mb-6 text-xs" onClick={handleSendEmail}>
                        Resend Email
                    </button>
                </div>
            )}

            {/* 이메일 인증 코드 확인 버튼 */}
            <div className="w-full max-w-sm">
                <button
                    className="w-full h-14 text-white text-lg py-2 px-4 rounded-full"
                    style={{ backgroundColor: '#0147E5' }}
                    >
                    Confirm
                </button>
            </div>

            {/* 이메일 검증 이후에 재설정할 비밀번호 입력란 */}
            {checked && (
                <div className="w-full max-w-sm mt-10">
                    {/* Password Input Section */}
                    <div className="w-full">
                        <label className="text-sm mb-2 block text-[#A3A3A3]">Password</label>
                        <input
                            type="password"
                            placeholder="Please enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-14 p-4 rounded-xl bg-gray-900 text-white border border-[#35383F] focus:outline-none text-xs mb-4"
                        />
                    </div>

                    {/* Confirm Password Section */}
                    <div className="w-full">
                        <label className="text-sm mb-2 block text-[#A3A3A3]">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Please confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full h-14 p-4 rounded-xl bg-gray-900 text-white border border-[#35383F] focus:outline-none text-xs mb-4"
                        />
                    </div>
                </div>
            )}

            {/* 비밀번호 변경 버튼 */}
            <div className="w-full max-w-sm">
                <button
                    className="w-full h-14 text-white text-lg py-2 px-4 rounded-full"
                    style={{ backgroundColor: "#0147E5", cursor: password ? 'pointer' : 'not-allowed', opacity: password ? 1 : 0.5 }}
                    onClick={handleChangePw}
                    disabled = {!password}
                    >
                    Change
                </button>
            </div>

            {/* 모달창 */}
            {showModal && (
                <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center w-full max-w-sm">
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

export default FindPassword;
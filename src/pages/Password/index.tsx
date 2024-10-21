import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSignupStore from '@/shared/store/SignupState';
import signup from '@/entities/User/api/signUp';

const SignupPassword: React.FC = () => {
    const { email, password, setPassword } = useSignupStore();
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // 비밀번호 유효성 검사 및 회원가입 완료
    const handleSignup = async () => {
        if (password === '') {
            setModalMessage('비밀번호를 입력해주세요.');
            setShowModal(true);
            return;
        }else if (password !== confirmPassword) {
            setModalMessage('비밀번호가 일치하지 않습니다.');
            setShowModal(true);
            return;
        }else{
            try{
                const result = await signup(email, password);
                if(result){
                    navigate('/home'); 
                }else{
                    setModalMessage('회원가입 오류. 비밀번호를 확인해주세요.');
                    setShowModal(true);
                }
            }catch(error: any){
                setModalMessage('회원가입 오류. 비밀번호를 확인해주세요.');
                setShowModal(true);
            }
        }
    };

    return (
        <div className="flex flex-col items-center text-white mx-6 md:mx-28 max-w-screen-xl relative min-h-screen pb-20">
            {/* Header Section */}
            <div className="flex items-center w-full mt-4 relative">
                <h1 className="text-2xl mx-auto font-semibold">Signup</h1>
            </div>

            {/* Password Input Section */}
            <div className="w-full max-w-sm mt-10">
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
            <div className="w-full max-w-sm mt-4">
                <label className="text-sm mb-2 block text-[#A3A3A3]">Confirm Password</label>
                <input
                    type="password"
                    placeholder="Please confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-14 p-4 rounded-xl bg-gray-900 text-white border border-[#35383F] focus:outline-none text-xs mb-4"
                />
            </div>

            {/* Sign Up Button - 페이지 하단에 고정 */}
            <div className="w-full max-w-md absolute bottom-16 left-1/2 transform -translate-x-1/2">
                <button
                    className="w-full py-4 rounded-full text-lg font-semibold"
                    style={{ backgroundColor: '#0147E5' }}
                    onClick={handleSignup}
                    >
                    Sign up
                </button>
            </div>

            
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

export default SignupPassword;

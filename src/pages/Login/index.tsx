import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaApple } from 'react-icons/fa';
import emailLogin from '@/entities/User/api/login';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const loginBtn = async () => {
    // 이메일 형식 유효성 검사
    if (!validateEmail(email)) {
      setModalMessage('이메일 형식을 확인해주세요.');
      setShowModal(true);
      return;
    }

    try{
        const result = await emailLogin(email, password);
        if(result){
             setShowModal(true);
             navigate('/home');
        }
    }catch(error:any){
        console.log(error);
    }
  };

  // 이메일 형식 유효성 검사 함수
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <div className="flex flex-col items-center text-white mx-6 md:mx-28">
        <div className="flex items-center w-full mt-[100px] relative">
            <h1 className="text-2xl mx-auto font-semibold">Login</h1>
        </div>

        {/* 이메일 및 비밀번호 입력란 */}
        <div className="mt-8 w-11/12 max-w-md">
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-2xl mb-4 bg-gray-900 text-white text-base border border-[#35383F] focus:outline-none"
                />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded-2xl bg-gray-900 text-white text-base border border-[#35383F] focus:outline-none"
                />
            <div 
                className="text-right mt-2 text-sm text-[#D4D4D4] cursor-pointer"
                onClick={() => navigate('/find-password')}>
                Forgot Password?
            </div>
        </div>

        {/* 로그인 버튼 */}
        <div className="mt-8 w-11/12 max-w-md">
            <button
                className="w-full h-[56px] py-4 rounded-full text-lg font-semibold"
                style={{ backgroundColor: "#0147E5", cursor: email && password ? 'pointer' : 'not-allowed', opacity: email && password ? 1 : 0.5 }}
                onClick={loginBtn}
                disabled={!email || !password}
                >
                Login
            </button>
        </div>

        {/* SNS 로그인 옵션 */}
        <div className="mt-8 w-full max-w-md text-center">
            <p className="text-sm text-[#A3A3A3] mb-4">Or</p>
            <div className="flex justify-center gap-20">
                <button className="p-3 bg-white rounded-full">
                    <FaGoogle className="text-black text-2xl" />
                </button>
                <button className="p-3 bg-white rounded-full">
                    <FaApple className="text-black text-2xl" />
                </button>
            </div>
        </div>

        {/* 회원가입 링크 */}
        <div className="mt-16 w-full max-w-md text-center">
            <p className="text-lg text-[#A3A3A3]">
                Don’t you have an account?{' '}
                <span
                    className="text-[#0147E5] cursor-pointer underline"
                    onClick={() => navigate('/signup-email')}
                    >
                    Sign Up
                </span>
            </p>
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

export default Login;
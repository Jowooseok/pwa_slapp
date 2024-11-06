import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaApple } from 'react-icons/fa';
import emailLogin from '@/entities/User/api/login';
import { CredentialResponse, GoogleLogin, googleLogout } from '@react-oauth/google';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [appleScriptLoaded, setAppleScriptLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        
        if (accessToken) {
            navigate('/home');
        }
    }, [navigate]);

    useEffect(() => {
        // 스크립트 로드 상태를 확인하는 로직
        const checkAppleScript = () => {
            if (window.AppleID && window.AppleID.auth) {
                setAppleScriptLoaded(true);
            } else {
                setTimeout(checkAppleScript, 100); // 0.1초 후에 다시 체크
            }
        };
        
        checkAppleScript();
    }, []);

    const loginBtn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 폼 제출 시 새로고침 방지

        // 이메일 형식 유효성 검사
        if (!validateEmail(email)) {
            setModalMessage('이메일 형식을 확인해주세요.');
            setShowModal(true);
            return;
        }

        try {
            setLoading(true);
            const result = await emailLogin(email, password);
            if (result) {
                setShowModal(true);
                navigate('/home');
            }
        } catch (error: any) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // 이메일 형식 유효성 검사 함수
    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleGoogleLoginSuccess = (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            console.log('Google Login Success:', credentialResponse.credential);
            handleGoogleSignIn(credentialResponse.credential);
        } else {
            console.error('Google Credential is missing.');
            setModalMessage('Google 로그인에 실패했습니다. 다시 시도해주세요.');
            setShowModal(true);
        }
    };

    const handleGoogleLoginFailure = () => {
        console.error('Google Login Error');
        setModalMessage('Google 로그인에 실패했습니다. 다시 시도해주세요.');
        setShowModal(true);
    };

    const handleGoogleSignIn = async (credential: string) => {
        try {
            setLoading(true);
            const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: credential }),
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem('accessToken', data.accessToken);
                navigate('/home');
            } else {
                setModalMessage(data.message || 'Google 로그인에 실패했습니다.');
                setShowModal(true);
            }
        } catch (error) {
            console.error('Google 로그인 오류:', error);
            setModalMessage('로그인에 실패했습니다. 다시 시도해주세요.');
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };


    const handleAppleSignIn = () => {
        const appleClientId = import.meta.env.VITE_APPLE_CLIENT_ID;
        const appleRedirectUri = import.meta.env.VITE_APPLE_REDIRECT_URI;

        if (!appleScriptLoaded) {
            console.error('Apple Sign-In script is not loaded yet.');
            return;
        }

        window.AppleID.auth.init({
            clientId: appleClientId,
            scope: 'email',
            redirectURI: appleRedirectUri,
            usePopup: true,
        });

        window.AppleID.auth.signIn().then((response: any) => {
            const { authorization } = response;
            const code = authorization.code; // 서버로 전송할 authorization code
            const id_token = authorization.id_token; // 서버에서 ID 토큰을 사용할 수 있습니다.
            
            // 서버로 code와 id_token 전송하여 사용자 인증 처리
            handleAppleLogin(code, id_token);
        }).catch((error: any) => {
            console.error('Apple Sign-In error:', error);
            setModalMessage('Apple 로그인에 실패했습니다. 다시 시도해주세요.');
            setShowModal(true);
        });
    };

    

    const handleAppleLogin = async (code: string, id_token: string) => {
        try {
            setLoading(true);
            const response = await fetch('/api/auth/apple', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, id_token }),
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('accessToken', data.accessToken);
                navigate('/home');
            } else {
                setModalMessage(data.message || 'Apple 로그인에 실패했습니다.');
                setShowModal(true);
            }
        } catch (error) {
            console.error('Apple 로그인 오류:', error);
            setModalMessage('로그인에 실패했습니다. 다시 시도해주세요.');
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center text-white mx-6 md:mx-28">
            <div className="flex items-center w-full mt-[100px] relative">
                <h1 className="text-2xl mx-auto font-semibold">Login</h1>
            </div>

            {/* 이메일 및 비밀번호 입력란 */}
            <form onSubmit={loginBtn} className="mt-8 w-11/12 max-w-md">
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
                    onClick={() => navigate('/find-password')}
                >
                    Forgot Password?
                </div>

                {/* 로그인 버튼 */}
                <div className="mt-8">
                    <button
                        type="submit"
                        className="w-full h-[56px] py-4 rounded-full text-lg font-semibold"
                        style={{
                            backgroundColor: "#0147E5",
                            cursor: email && password ? 'pointer' : 'not-allowed',
                            opacity: email && password ? 1 : 0.5,
                        }}
                        disabled={!email || !password || loading} // 로딩 중에는 버튼 비활성화
                    >
                        {loading ? 'Loading...' : 'Login'} {/* 로딩 중에는 로딩 메시지 표시 */}
                    </button>
                </div>
            </form>


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

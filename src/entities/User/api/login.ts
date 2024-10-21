import api from '@/shared/api/axiosInstance';

interface LoginResponse {
  code: string;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
  message?: string;
}

// 이메일 로그인 요청
async function emailLogin(email: string, password: string): Promise<boolean> {
    const data = { 
        userId: email, 
        userPw: password 
    };

  try {
    const response = await api.post<LoginResponse>('/auth/login', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.code === 'OK' && response.data.data) {
      const { accessToken, refreshToken } = response.data.data;
      // 로그인 성공 시, 로컬 스토리지에 토큰 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      return true;
    } else if (response.data.code !== 'OK') {
      console.warn('Step: login 응답 코드가 OK가 아님:', response.data.message);
      throw new Error(response.data.message || 'Login failed');
    }

  } catch (error: any) {
    console.error('Step: login 실패:', error);
    let errorMessage = 'Login failed. Please try again.';
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.request) {
      errorMessage = 'No response from server. Please try again later.';
    } else {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }

  // 모든 경로에서 값을 반환하도록 기본 반환값 추가
  return false;
}

export default emailLogin;
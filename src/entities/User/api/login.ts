import api from '@/shared/api/axiosInstance';

// 이메일 로그인 요청
async function emailLogin(email: string, password: string): Promise<boolean> {
  const data = { 
    userId: email, 
    userPw: password 
  };

  try {
    const response = await api.post('/auth/login', data);

    if (response.data.code === 'OK' && response.headers['authorization']) {
      // Bearer 접두사를 제거
      const accessToken = response.headers['authorization'].replace('Bearer ', '');
      // 로그인 성공 시, 로컬 스토리지에 Access Token 저장
      localStorage.setItem('accessToken', accessToken);
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

  return false;
}

export default emailLogin;

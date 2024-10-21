import api from '@/shared/api/axiosInstance';

interface VerifyCodeResponse {
  code: string;
  message?: string;
}

// 이메일 인증 코드 검증
async function verifyEmailCode(email: string, verificationCode: string): Promise<boolean> {
  const data = {
    email,
    verificationCode,
  };

  try {
    const response = await api.post<VerifyCodeResponse>('/verify-email-code', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.code === 'OK') {
      console.log('Verification code verified successfully');
      return true;
    } else {
      console.warn('Step: verification code 응답 코드가 OK가 아님:', response.data.message);
      throw new Error(response.data.message || 'Verification code is incorrect');
    }
  } catch (error: any) {
    console.error('Step: verification code 검증 실패:', error);
    let errorMessage = 'Verification failed. Please try again.';
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.request) {
      errorMessage = 'No response from server. Please try again later.';
    } else {
      errorMessage = error.message;
    }
    throw new Error(errorMessage);
  }
}

export default verifyEmailCode;

import api from '@/shared/api/axiosInstance';

interface SendEmailResponse {
  code: string;
  message?: string;
}

// 이메일 인증 코드 발송
async function sendVerificationCode(email: string): Promise<boolean> {
  const data = { email };

  try {
    const response = await api.post<SendEmailResponse>('/send-verification-code', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.code === 'OK') {
      console.log('Verification code sent successfully');
      return true;
    } else {
      console.warn('Step: verification code 응답 코드가 OK가 아님:', response.data.message);
      throw new Error(response.data.message || 'Failed to send verification code');
    }
  } catch (error: any) {
    console.error('Step: verification code 전송 실패:', error);
    let errorMessage = 'Failed to send verification code. Please try again.';
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

export default sendVerificationCode;

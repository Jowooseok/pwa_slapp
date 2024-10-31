import api from '@/shared/api/axiosInstance';

const sendVerificationCode = async (email: string): Promise<void> => {
  const data = { 
    userId: email,
  };

  try {
    const response = await api.post('/auth/send-email-verification', data);

    if (response.data.code !== 'OK') {
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
};

export default sendVerificationCode;

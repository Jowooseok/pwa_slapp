import api from '@/shared/api/axiosInstance';
import { NavigateFunction } from 'react-router-dom';

// 토큰 갱신 함수
async function refreshToken() {
    try {
        const response = await api.post('/auth/refresh', {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });

        if (response.data.code === 'OK') {
            const newAccessToken = response.data.data;
            localStorage.setItem('accessToken', newAccessToken);
            return newAccessToken;
        } else {
            console.warn('Token refresh failed:', response.data.message);
            throw new Error(response.data.message || 'Token refresh failed');
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
}

async function storeResult(formData: FormData, type: string, navigate: any): Promise<any>  {
    let accessToken = localStorage.getItem('accessToken');
    const refreshTokenValue = localStorage.getItem('refreshToken');

    let endpoint = '';
    if (type === 'dental') {
      endpoint = '/diagnosis/dental/real';
    } else if (type === 'xray') {
      endpoint = '/diagnosis/dental/xray';
    }

    if (!endpoint) {
      console.error(`Invalid type: ${type}`);
      return;
    }

    try {
      const response = await api.post(endpoint, formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning': '69420',
        },
        withCredentials: true
      });
      if (response.data.code === 'OK') {
        console.log("Data stored successfully.");
        return true;
      } else {
        console.warn(`Unexpected response code: ${response.data.code}`);
      }
    } catch (error: any) {
      console.error('Error occurred while fetching records:', error.message);

      if (error.response && error.response.status === 404) {
          console.log('Access token expired, attempting to refresh token...');
          try {
              accessToken = await refreshToken(); // 토큰 갱신
              return await storeResult(formData, type, navigate); // 갱신된 토큰으로 재시도
          } catch (refreshError) {
              console.error('Failed to refresh token:', refreshError);
              // 로그아웃 및 로그인 페이지로 이동 처리
              localStorage.removeItem('accessToken');
              navigate('/login', { replace: true });
              throw new Error('No access or refresh token found. Please log in.');
          }
      } else {
          console.error('Error fetching records:', error);
          throw error;
      }
    }
}

export default storeResult;

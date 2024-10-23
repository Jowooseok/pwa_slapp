import api from '@/shared/api/axiosInstance';

// 토큰 갱신 함수
async function refreshToken(refreshTokenValue: string) {
    try {
        const response = await api.post('/auth/refresh', { refreshToken: refreshTokenValue }, {
            headers: {
                'Content-Type': 'application/json',
            }
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

async function storeResult(formData: FormData, type: string): Promise<any>  {
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
      },
    });
    if (response.data.code === 'OK') {
      console.log("Data stored successfully.");
      return true;
    } else {
      console.warn(`Unexpected response code: ${response.data.code}`);
    }
  } catch (error: any) {
    // 토큰 만료 시 재시도
    if (error.response && error.response.status === 401 && refreshTokenValue) {
        console.log("Access token expired, attempting to refresh token...");
        try {
            accessToken = await refreshToken(refreshTokenValue);
            return await storeResult(formData, type); // 갱신된 토큰으로 재시도
        } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
            throw refreshError;
        }
    } else {
        console.error("Error registering pet:", error);
        throw error;
    }
}
}

export default storeResult;

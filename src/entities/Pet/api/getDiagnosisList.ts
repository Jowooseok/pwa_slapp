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

// 진단 목록 가져오기
async function getDiagnosisList(retryCount = 0) {
    let accessToken = localStorage.getItem('accessToken');
    const refreshTokenValue = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshTokenValue) {
        throw new Error('No access or refresh token found. Please log in.');
    }

    try {
        const response = await api.get('/get-diagnosis-list', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        
        if (response.data.code === 'OK') {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Failed to fetch diagnosis list');
        }
    } catch (error: any) {
        if (error.response && error.response.status === 401 && retryCount < 1) {
            console.log("Access token expired, attempting to refresh token...");
            try {
                accessToken = await refreshToken(refreshTokenValue);
                return await getDiagnosisList(retryCount + 1); // 갱신된 토큰으로 한 번만 재시도
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                throw refreshError;
            }
        } else {
            console.error("Error fetching diagnosis list:", error);
            throw error;
        }
    }
}

export default getDiagnosisList;

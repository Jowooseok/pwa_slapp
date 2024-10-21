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

// 진단 정보 가져오는 함수
async function getDiagnosisInfo(id: string): Promise<any> {
    let accessToken = localStorage.getItem('accessToken');
    const refreshTokenValue = localStorage.getItem('refreshToken');

    try {
        const response = await api.get(`/diagnosis/${id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        if (response.data.code === 'OK') {
            return response.data.data; // 진단 정보 반환
        } else {
            throw new Error(response.data.message || 'Failed to get diagnosis info');
        }
    } catch (error: any) {
        // 토큰 만료 시 토큰 갱신 후 재시도
        if (error.response && error.response.status === 401 && refreshTokenValue) {
            console.log("Access token expired, attempting to refresh token...");
            try {
                accessToken = await refreshToken(refreshTokenValue);
                return await getDiagnosisInfo(id); // 갱신된 토큰으로 재시도
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                throw refreshError;
            }
        } else {
            console.error("Error getting diagnosis info:", error);
            throw error;
        }
    }
}

export default getDiagnosisInfo;

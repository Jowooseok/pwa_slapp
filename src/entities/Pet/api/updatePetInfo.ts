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
        // 로그아웃 처리 등 추가적인 오류 처리 로직 필요
        throw error;
    }
}

// 반려동물 정보 업데이트 함수
async function updatePetInfo(formData: FormData) {
    let accessToken = localStorage.getItem('accessToken');
    const refreshTokenValue = localStorage.getItem('refreshToken');

    try {
        const response = await api.post(`/update-pet`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (response.data.code === 'OK') {
            // 반려동물 정보가 정상적으로 업데이트됨
            return true;
        } else {
            throw new Error(response.data.message || 'Failed to update pet information');
        }
    } catch (error: any) {
        // 토큰 만료 시 재시도
        if (error.response && error.response.status === 401 && refreshTokenValue) {
            console.log("Access token expired, attempting to refresh token...");
            try {
                accessToken = await refreshToken(refreshTokenValue);
                return await updatePetInfo(formData); // 갱신된 토큰으로 재시도
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                throw refreshError;
            }
        } else {
            console.error("Error updating pet information:", error);
            throw error;
        }
    }
}

export default updatePetInfo;

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


// 반려동물 목록 가져오기 함수
async function getPetList(): Promise<any> {
    let accessToken = localStorage.getItem('accessToken');
    const refreshTokenValue = localStorage.getItem('refreshToken');

    try {
        const response = await api.get('/mypets', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        // 응답이 JSON인지 확인
        if (typeof response.data !== 'object') {
            throw new Error('Unexpected response format');
        }

        if (response.data.code === 'OK') {
            console.log("정상 작동~! ", response.data);
            return response.data.data; // 서버로부터 반려동물 데이터
        } else {
            console.error("Unexpected response: ", response);
            throw new Error(response.data.message || 'Failed to fetch pet information');
        }
    } catch (error: any) {
        console.error("Error occurred while fetching pet information:", error.message);

        // 상태 코드 확인 및 재시도 로직
        if (error.response && error.response.status === 401 && refreshTokenValue) {
            console.log("Access token expired, attempting to refresh token...");
            try {
                accessToken = await refreshToken(refreshTokenValue);
                return await getPetList(); // 갱신된 토큰으로 재시도
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                throw refreshError;
            }
        } else {
            console.error("Error fetching pet information:", error);
            throw error;
        }
    }
}


export default getPetList;
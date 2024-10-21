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

// 반려동물 등록 함수
async function registerPet(petInfo: { name: string, image: File }) {
    let accessToken = localStorage.getItem('accessToken');
    const refreshTokenValue = localStorage.getItem('refreshToken');

    // FormData 객체 생성 및 데이터 추가
    const formData = new FormData();
    formData.append('json', new Blob([JSON.stringify({ name: petInfo.name })], { type: "application/json" })); // JSON 형식의 데이터를 문자열로 추가
    formData.append('file', petInfo.image); // 이미지 파일 추가

    try {
        const response = await api.post('/register-pet', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // FormData를 전송할 때는 multipart/form-data 헤더 사용
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (response.data.code === 'OK') {
            // 정상적으로 반려동물 정보 등록됨
            return true;
        } else {
            throw new Error(response.data.message || 'Failed to register pet');
        }
    } catch (error: any) {
        // 토큰 만료 시 재시도
        if (error.response && error.response.status === 401 && refreshTokenValue) {
            console.log("Access token expired, attempting to refresh token...");
            try {
                accessToken = await refreshToken(refreshTokenValue);
                return await registerPet(petInfo); // 갱신된 토큰으로 재시도
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

export default registerPet;

import api from '@/shared/api/axiosInstance';

// 토큰 갱신 함수
async function tryRefreshToken(): Promise<string> {
    try {
        const response = await api.get('/auth/refresh', {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '69420',
            },
            withCredentials: true
        });

        // Authorization 헤더에서 새로운 액세스 토큰을 추출
        const newAccessToken = response.headers['authorization'];

        if (newAccessToken) {
            // 새로운 액세스 토큰을 로컬 스토리지에 저장
            localStorage.setItem('accessToken', newAccessToken.replace('Bearer ', ''));
            return newAccessToken;
        } else {
            console.warn('Token refresh failed: Authorization header is missing');
            throw new Error('Token refresh failed: Authorization header is missing');
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
}

// 반려동물 등록 함수
async function registerPet(petInfo: { name: string, image: File }, navigate: any): Promise<any> {
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
        console.error('에러 발생 시점:', error.message);

        // 상태 코드 확인 및 재시도 로직
        if (error.response && error.response.status === 404) {
            console.log("리프레시 토큰으로 토큰 재발급 시도 중...");
            try {
                accessToken = await tryRefreshToken();
                return await registerPet(petInfo, navigate); // 갱신된 토큰으로 재시도
            } catch (refreshError) {
                console.error('리프레시 토큰 갱신 실패:', refreshError);
                localStorage.removeItem('accessToken');
                navigate('/login', { replace: true });
                throw refreshError;
            }
        } else if (error.response && error.response.status === 404) {
            console.error('Resource not found:', error);
            throw new Error('Resource not found. Please check the endpoint.');
        } else {
            console.error('Error fetching pet list:', error);
            throw error;
        }
    }
}

export default registerPet;

import api from '@/shared/api/axiosInstance';
import { NavigateFunction } from 'react-router-dom';

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
// 기록을 가져오는 함수
async function getRecords(navigate: NavigateFunction): Promise<any> {
    let accessToken = localStorage.getItem('accessToken');
    console.log("액세스 토큰: ", accessToken);
    
    if (!accessToken) {
        console.error('No access token found. Redirecting to login.');
        navigate('/login', { replace: true });
        throw new Error('No access token found. Please log in.');
    }

    try {
        const response = await api.get('/diagnosis/record', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'ngrok-skip-browser-warning': '69420',
            },
            withCredentials: true
        });

        if (response.data.code === 'OK') {
            console.log("get Records: ", response.data.data);
            return response.data.data;
        } else {
            // console.error('Unexpected response:', response);
            // throw new Error(response.data.message || 'Failed to fetch records');
        }
    } catch (error: any) {
        console.error('에러 발생 시점:', error.message);

        // 상태 코드 확인 및 재시도 로직
        if (error.response && error.response.status === 404) {
            console.log("리프레시 토큰으로 토큰 재발급 시도 중...");
            try {
                accessToken = await tryRefreshToken();
                return await getRecords(navigate); // 갱신된 토큰으로 재시도
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

export default getRecords;

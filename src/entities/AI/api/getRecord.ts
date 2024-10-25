import api from '@/shared/api/axiosInstance';
import { NavigateFunction } from 'react-router-dom';

// 토큰 갱신 함수
async function tryRefreshToken() {
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
            // console.warn('Token refresh failed:', response.data.message);
            // throw new Error(response.data.message || 'Token refresh failed');
        }
    } catch (error) {
        // console.error('Error refreshing token:', error);
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
        console.error('Error occurred while fetching records:', error.message);

        // if (error.response && error.response.status === 404) {
        //     console.log('Access token expired, attempting to refresh token...');
        //     try {
        //         accessToken = await refreshToken(); // 토큰 갱신
        //         return await getRecords(navigate); // 갱신된 토큰으로 재시도
        //     } catch (refreshError) {
        //         console.error('Failed to refresh token:', refreshError);
        //         // 로그아웃 및 로그인 페이지로 이동 처리
        //         localStorage.removeItem('accessToken');
        //         navigate('/login', { replace: true });
        //         throw new Error('No access or refresh token found. Please log in.');
        //     }
        // } else {
        //     console.error('Error fetching records:', error);
        //     throw error;
        // }
    }
}

export default getRecords;

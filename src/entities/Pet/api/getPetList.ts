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

        if (response.data.code === 'OK') {
            const newAccessToken = response.data.data;
            localStorage.setItem('accessToken', newAccessToken);
            return newAccessToken;
        } else {
            console.warn('Token refresh failed:', response.data.message);
            throw new Error(response.data.message || 'Token refresh failed');
        }
    } catch (error) {
        // console.error('Error refreshing token:', error);
        throw error;
    }
}

// 반려동물 목록 가져오기 함수
async function getPetList(navigate: any): Promise<any> {
    let accessToken = localStorage.getItem('accessToken');
    console.log("액세스 토큰: ", accessToken);

    try {
        const response = await api.get('/mypets', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'ngrok-skip-browser-warning': '69420',
            },
            withCredentials: true
        });

        if (response.data.code === 'OK') {
            return response.data.data;
        } else {
            console.error('무슨일이야: ', response);
            throw new Error(response.data.message || 'Failed to fetch pet information');
        }
    } catch (error: any) {
        console.error('에러 petList:', error.message);

        if(error.message === "Request failed with status code 404"){
            console.log("리프레시 토큰으로 토큰 재발급 시도");
            accessToken = await tryRefreshToken();
            
        }
        // 상태 코드 확인 및 재시도 로직
        // if (error.response && error.response.status === 401) {
        //     console.log('Access token expired, attempting to refresh token...');
        //     try {
        //         accessToken = await refreshToken(); // 토큰 갱신
        //         return await getPetList(navigate); // 갱신된 토큰으로 재시도
        //     } catch (refreshError) {
        //         console.error('Failed to refresh token:', refreshError);
        //         // 리프레시 토큰이 만료되었거나 실패한 경우 리다이렉션 처리
        //         localStorage.removeItem('accessToken');
        //         navigate('/login', { replace: true });
        //         throw refreshError;
        //     }
        // } else if (error.response && error.response.status === 404) {
        //     console.error('Resource not found:', error);
        //     throw new Error('Resource not found. Please check the endpoint.');
        // } else {
        //     console.error('Error fetching records:', error);
        //     throw error;
        // }
    }
}

export default getPetList;

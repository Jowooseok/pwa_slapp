import api from '@/shared/api/axiosInstance';
import { NavigateFunction } from 'react-router-dom';

// 토큰 갱신 함수
async function refreshToken() {
    try {
        const response = await api.post('/auth/refresh', {}, {
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
            console.warn('Token refresh failed:', response.data.message);
            throw new Error(response.data.message || 'Token refresh failed');
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
    }
}

async function deletePet(petinfo: any, navigate: any): Promise<any> {
    let accessToken = localStorage.getItem('accessToken');
    const id = petinfo;
    const url = `pet/${id}`;

    try{
        const response = await api.delete(url,{
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            withCredentials: true
        });

        if(response.data.code === 'OK'){
            return true;
        } else{
            // 비정상적인 경우의 로직
        }

    }catch(error: any){
         // 토큰 만료 시 재시도
         if (error.response && error.response.status === 401) {
            console.log('Access token expired, attempting to refresh token...');
            try {
                accessToken = await refreshToken(); // 토큰 갱신
                return await deletePet(petinfo, navigate); // 갱신된 토큰으로 재시도
            } catch (refreshError) {
                console.error('Failed to refresh token:', refreshError);
                // 로그아웃 및 로그인 페이지로 이동 처리
                localStorage.removeItem('accessToken');
                navigate('/login', { replace: true });
                throw new Error('No access or refresh token found. Please log in.');
            }
        } else {
            console.error('Error fetching records:', error);
            throw error;
        }
    }
}

export default deletePet;
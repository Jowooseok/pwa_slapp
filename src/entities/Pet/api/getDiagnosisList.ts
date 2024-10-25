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

        console.log("리프레시 로그 : ", response);

        // if (response.data.code === 'OK') {
        //     // const newAccessToken = response.data.data;
        //     // localStorage.setItem('accessToken', newAccessToken);
        //     // return newAccessToken;
        // } else {
        //     // console.warn('Token refresh failed:', response.data.message);
        //     throw new Error(response.data.message || 'Token refresh failed');
        // }
    } catch (error) {
        // console.error('Error refreshing token:', error);
        throw error;
    }
}

// 진단 목록 가져오기
async function getDiagnosisList(type: string | null, record: string | null, petId: string, navigate: any): Promise<any> {
    let accessToken = localStorage.getItem('accessToken') || null;

    try {
        const filter = {
            type: type,
            record: record,
            petId: petId
        };

        const response = await api.post('/diagnosis', filter, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            withCredentials: true
        });

        if (response.data.code === 'OK') {
            console.log("뭐고 :", response.data);
            if(response.data.data){
                console.log(response.data.data.length);
                return response.data.data;
            }else{
                return null;
            }
        } else {
            // throw new Error(response.data.message || 'Failed to fetch diagnosis list');
        }
    } catch (error: any) {
        console.error('Error occurred while fetching records:', error.message);
        if(error.response){
            try{
                const acc = await tryRefreshToken();
                console.log("new token? ", acc);
                // return await getDiagnosisList(type, record, petId, navigate);
            }catch(refreshError){
                console.error('Failed to refresh token:', refreshError);
            }
        }
        

        // if (error.response && error.response.status === 404) {
        //     console.log('Access token expired, attempting to refresh token...');
        //     try {
        //         accessToken = await refreshToken(); // 토큰 갱신
        //         return await getDiagnosisList(type, record, petId, navigate); // 갱신된 토큰으로 재시도
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

export default getDiagnosisList;

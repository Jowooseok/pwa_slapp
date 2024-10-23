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

// 진단 목록 가져오기
async function getDiagnosisList(type: string | null, record: string | null, petId: string): Promise<any> {
    let accessToken = localStorage.getItem('accessToken');
    const refreshTokenValue = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshTokenValue) {
        throw new Error('No access or refresh token found. Please log in.');
    }

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
            throw new Error(response.data.message || 'Failed to fetch diagnosis list');
        }
    } catch (error: any) {
        if (error.response?.status === 401 && refreshTokenValue) {
            console.log("Access token expired, attempting to refresh token...");
            try {
                const newAccessToken = await refreshToken(refreshTokenValue);
                // 갱신된 토큰으로 재시도
                return await getDiagnosisList(type, record, petId); 
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                throw refreshError;
            }
        } else {
            console.error("Error fetching diagnosis list:", error);
            throw error;
        }
    }
}

export default getDiagnosisList;

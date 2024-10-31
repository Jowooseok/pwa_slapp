import api from '@/shared/api/axiosInstance';

interface PetInfo {
  name: string;
  image: File;
}

const registerPet = async (petInfo: PetInfo): Promise<void> => {
  let accessToken = localStorage.getItem('accessToken');

  // FormData 객체 생성 및 데이터 추가
  const formData = new FormData();
  formData.append(
    'json',
    new Blob([JSON.stringify({ name: petInfo.name })], { type: 'application/json' })
  );
  formData.append('file', petInfo.image);

  try {
    const response = await api.post('/register-pet', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.data.code !== 'OK') {
      throw new Error(response.data.message || 'Failed to register pet');
    }
  } catch (error: any) {
    // 에러를 다시 던져서 호출한 곳에서 처리하도록 함
    throw error;
  }
};

export default registerPet;

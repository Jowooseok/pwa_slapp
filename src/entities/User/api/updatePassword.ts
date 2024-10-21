import api from '@/shared/api/axiosInstance';

async function updatePasseword(email: string, password: string): Promise<boolean> {
    const data = {
      email: email,
      password: password,
    };
  
    try {
      const response = await api.post('/update-password', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.data.code === 'OK') {
        console.log('Password update successful');
        return true;
      } else {
        console.warn('Password update failed:', response.data.message);
        throw new Error(response.data.message || 'Password update failed');
      }
    } catch (error: any) {
      console.error('Password update error:', error);
      throw new Error('Password update failed. Please try again.');
    }
  }
  
  export default updatePasseword;
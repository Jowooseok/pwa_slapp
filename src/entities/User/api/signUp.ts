import api from '@/shared/api/axiosInstance';

async function signup(email: string, password: string): Promise<boolean> {
  const data = {
    userId: email,
    userPw: password,
  };

  try {
    const response = await api.post('/auth/signup', data);

    if (response.data.code === 'OK') {
      console.log('Signup successful');
      return true;
    } else {
      console.warn('Signup failed:', response.data.message);
      throw new Error(response.data.message || 'Signup failed');
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    throw new Error('Signup failed. Please try again.');
  }
}

export default signup;

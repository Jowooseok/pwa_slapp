import api from '@/shared/api/axiosInstance';

async function storeResult(image: File, date: string, className: string, type: string) {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('date', date);
  formData.append('className', className);

  let endpoint = '';
  if (type === 'dental') {
    endpoint = '/store/dental';
  } else if (type === 'xray') {
    endpoint = '/store/xray';
  }

  if (!endpoint) {
    console.error(`Invalid type: ${type}`);
    return;
  }

  try {
    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data.code === 'OK') {
      console.log("Data stored successfully.");
    } else {
      console.warn(`Unexpected response code: ${response.data.code}`);
    }
  } catch (error) {
    console.error("Error storing data:", error);
    throw error;
  }
}

export default storeResult;

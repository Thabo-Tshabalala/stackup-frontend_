import API from './api';

export const walletData = async () => {
  try {
    const res = await API.get('wallet');
        console.log('Full response:', res);   
    console.log('Data only:', res.data); 
    return res.data;
  } catch (err) {
    console.error('Error fetching wallet via backend:', err);
    throw err;
  }
};
import axios from 'axios';

// function to send data to backend and database
const sendData = async (link ,data) => {
  try {
    // console.log('Sending data:', data); 
    const response = await axios.post(link, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (e) {
    console.error('error sending data:', e);
    throw e;
  }
};

export default sendData;

const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5001/api/v1/content', {
      section: 'home',
      content: { heroTitle: 'Test' }
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error response:', err.response?.data || err.message);
  }
}

test();

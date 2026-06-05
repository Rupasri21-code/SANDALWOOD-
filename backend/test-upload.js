const http = require('http');

const data = JSON.stringify({ identifier: 'admin@sandalwood.com', password: 'Admin@123' });

const req1 = http.request({
  host: 'localhost',
  port: 5001,
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res1) => {
  let body = '';
  res1.on('data', chunk => body += chunk);
  res1.on('end', () => {
    const json = JSON.parse(body);
    console.log("Login Status:", res1.statusCode);
    if (!json.data || !json.data.token) {
      console.log("No token:", json);
      return;
    }
    const token = json.data.token;
    console.log("Got token.");
    
    // Now request upload
    const fs = require('fs');
    const crypto = require('crypto');
    const boundary = '----WebKitFormBoundary' + crypto.randomBytes(8).toString('hex');
    const fileContent = fs.readFileSync('package.json');
    
    let postData = `--${boundary}\r\n`;
    postData += `Content-Disposition: form-data; name="file"; filename="package.json"\r\n`;
    postData += `Content-Type: application/json\r\n\r\n`;
    const postEnd = `\r\n--${boundary}--\r\n`;
    
    const req2 = http.request({
      host: 'localhost',
      port: 5001,
      path: '/api/v1/upload',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': Buffer.byteLength(postData) + fileContent.length + Buffer.byteLength(postEnd)
      }
    }, (res2) => {
      let body2 = '';
      res2.on('data', chunk => body2 += chunk);
      res2.on('end', () => {
        console.log("Upload Status:", res2.statusCode);
        console.log("Upload Body:", body2);
      });
    });
    
    req2.write(postData);
    req2.write(fileContent);
    req2.write(postEnd);
    req2.end();
  });
});

req1.write(data);
req1.end();

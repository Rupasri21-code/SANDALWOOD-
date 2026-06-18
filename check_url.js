const https = require('https');

https.get('https://sandalwoo.netlify.app/login', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const jsFiles = data.match(/_next\/static\/chunks\/[^\"]+\.js/g);
    if (!jsFiles) return console.log('No JS files found');
    
    // Pick the largest ones or just check layout/page/auth
    const filesToCheck = [...new Set(jsFiles)].filter(f => f.includes('app') || f.includes('layout') || f.includes('login'));
    
    filesToCheck.forEach(file => {
      https.get('https://sandalwoo.netlify.app/' + file, (r) => {
        let jsData = '';
        r.on('data', (c) => jsData += c);
        r.on('end', () => {
          const urls = jsData.match(/https?:\/\/[^\s\"\'\`]+/g);
          if (urls) {
            const apiUrls = urls.filter(u => u.includes('vercel') || u.includes('localhost') || u.includes('sandalwood'));
            if (apiUrls.length > 0) {
              console.log(`Found in ${file}:`, [...new Set(apiUrls)]);
            }
          }
        });
      });
    });
  });
});

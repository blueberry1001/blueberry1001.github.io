const http = require('http');

const url = 'http://localhost:5174/Gamedata/3DRougeAction/Build/Build.loader.js';

console.log(`Fetching ${url}...`);
http.get(url, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers, null, 2)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Response length: ${data.length} bytes`);
    if (data.length > 100) {
      console.log('Sample content:');
      console.log(data.slice(0, 100));
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});

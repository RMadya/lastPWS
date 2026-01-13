const http = require('http');

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/',
    method: 'GET'
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('✅ Server is running!');
        console.log('Status Code:', res.statusCode);
        console.log('Response:', data);
        process.exit(0);
    });
});

req.on('error', (error) => {
    console.error('❌ Server connection failed:', error.message);
    process.exit(1);
});

req.end();

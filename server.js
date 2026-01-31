// const { createServer } = require('http');
// const { parse } = require('url');
// const next = require('next');

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// // Increase max header size to 5MB
// const serverOptions = {
//   maxHeaderSize: 5 * 1024 * 1024, // 5MB
//   keepAliveTimeout: 60000, // Keep connections alive for 60 seconds
// };

// app.prepare().then(() => {
//   createServer(serverOptions, (req, res) => {
//     // Add custom CORS headers to allow large requests
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
//     // Handle preflight requests
//     if (req.method === 'OPTIONS') {
//       res.writeHead(200);
//       res.end();
//       return;
//     }
    
//     // Set custom header size limits
//     req.maxHeadersCount = 100; // Increase allowed number of headers
    
//     // Parse the URL
//     const parsedUrl = parse(req.url, true);
    
//     // Let Next.js handle the request
//     handle(req, res, parsedUrl);
//   }).listen(3000, (err) => {
//     if (err) throw err;
//     console.log('> Ready on http://localhost:3000 with custom server settings');
//     console.log('> Max header size increased to handle large requests');
//   });
// });


const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// ✅ Render provides PORT dynamically
const PORT = process.env.PORT || 3000;

const serverOptions = {
  maxHeaderSize: 5 * 1024 * 1024,
  keepAliveTimeout: 60000,
};

app.prepare().then(() => {
  createServer(serverOptions, (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, content-type"
    );

    if (req.method === "OPTIONS") {
      res.writeHead(200);
      res.end();
      return;
    }

    req.maxHeadersCount = 100;

    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(PORT, () => {
    console.log(✅ Server running on port ${PORT});
  });
});
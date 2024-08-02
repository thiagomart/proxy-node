const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
require('http-proxy-middleware').debug = true;
const PORT = 4000;

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${JSON.stringify(req.headers)} \n`);
  next();
});
// Proxy configuration
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000/',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxing request:', req.method, req.originalUrl, req.headers);
  },
  onProxyRes: (proxyRes, req, res) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  },
  onError: (err, req, res) => {
    console.error(`Error occurred while proxying request to ${req.url}:, err`);
    res.status(500).send('Proxy error');
  }
}));

app.listen(PORT, () => {
  console.log(`Node.js server is running on http://localhost:${PORT}`);
});
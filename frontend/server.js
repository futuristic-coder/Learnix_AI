import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Build dist path
const distPath = path.join(__dirname, 'dist');

// Check if dist folder exists
if (!fs.existsSync(distPath)) {
  console.error(`ERROR: dist folder not found at ${distPath}`);
  console.log('Current directory:', __dirname);
  console.log('Directory contents:', fs.readdirSync(__dirname));
  process.exit(1);
}

console.log(`Serving from: ${distPath}`);
console.log(`Dist files: ${fs.readdirSync(distPath).join(', ')}`);

// Serve static files with cache control
app.use(express.static(distPath, {
  maxAge: '1d',
  etag: false
}));

// Health check endpoint
app.get('/_health', (req, res) => {
  res.json({ status: 'ok' });
});

// SPA fallback - serve index.html for all routes that don't match static files
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error(`index.html not found at ${indexPath}`);
    res.status(404).send('index.html not found');
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});

import express from 'express';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();
const app = express();

app.use(compression());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../client/dist')));



app.get('/api/alive', (req, res) => {
  return res.json({ alive: true });
});

app.get('/api/helloworld', (req, res) => {
  res.send('hello world!');
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


app.use(function (err, req, res) {
  const error = app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({ error: error });
});

export default app;
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import userRoutes from './routes/noteRoutes.js'; // Sesuaikan path dengan struktur proyekmu

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/view', express.static(path.join(__dirname, 'view')));

// Or if you want direct access to index.html at /view:
app.get('/view', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

// Gunakan route user dengan prefix "/api"
app.use('/api', userRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

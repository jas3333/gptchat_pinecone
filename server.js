import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import gptRouter from './router/gptRouter.js';
import pineRouter from './router/pineRouter.js';
import connectDB from './utils/connectDB.js';

import cors from 'cors';

dotenv.config();

connectDB();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve(__dirname, './client/build')));
const PORT = process.env.PORT || 4005;

app.use('/api/v1/gpt', gptRouter);
app.use('/api/v1/pine', pineRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});

import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();


const port = process.env.PORT || 3000;

const origin = process.env.ORIGIN || 'http://localhost:3000';

import cors from 'cors';
app.use(cors({
  origin: origin,
}));

app.get('/', (req, res) => {
  res.send('Port and origin are working!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`${origin}`);
});

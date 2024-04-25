import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Jutood Crafts sever is running');
});

app.listen(port, () => {
  console.log(`Jutood Crafts sever is running on ${port} PORT`);
});
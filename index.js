import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jzumutc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Jutood Crafts sever is running');
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // create craft collection
    const craftCollection = client.db('craftsDB').collection('crafts');

    // get api (all)
    app.get('/crafts', async (req, res) => {
      const result = await craftCollection.find().toArray();
      res.send(result);
    });

    // get api (get single data by id)
    app.get('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      res.send(result);
    });

    // get api (get data by matching email)
    app.get('/my_crafts/:email', async (req, res) => {
      const query = { userEmail: req.params.email };
      const result = await craftCollection.find(query).toArray();
      res.send(result);
    });

    // post api
    app.post('/crafts', async (req, res) => {
      const data = req.body;
      const result = await craftCollection.insertOne(data);
      res.send(result);
    });

    // delete api
    app.delete('/crafts/:id', async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    });

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Jutood Crafts sever is running on ${port} PORT`);
});
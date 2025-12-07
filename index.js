const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const cors = require("cors");
const port = 3000;
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7q4cuiv.mongodb.net/?appName=Cluster0`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        // await client.connect();

        const database = client.db('petService')
        const petservices = database.collection('services')
        const orderCollection = database.collection('orders')
        //    post to DB
        app.post('/services', async (req, res) => {
            const data = req.body;
            const date = new Date();
            data.createAt = date;
            console.log(data)

            const result = await petservices.insertOne(data)
            res.send(data)
        })

        

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Hello! Developers")
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})
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

        //   Get from DB
        app.get('/services', async (req, res) => {
            const { category } = req.query;
            console.log(category)
            const query = {};
            if (category) {
                query.category = category;

            }
            const result = await petservices.find(query).toArray();
            res.send(result)
        })
        //    get for veiw details
        app.get('/services/:id', async (req, res) => {
            const id = req.params;

            const query = { _id: new ObjectId(id) };

            const result = await petservices.findOne(query)
            //   console.log(resul)
            res.send(result);
        })

        //  get for myservices
        app.get('/my-services', async (req, res) => {

            const { email } = req.query;
            // console.log(email)
            const query = { email: email };
            const result = await petservices.find(query).toArray();
            res.send(result)
            // console.log(result)
        })
        //    for update
        app.put("/update/:id", async (req, res) => {
            const data = req.body;
            const id = req.params;
            const query = { _id: new ObjectId(id) };
            const updateServices = {
                $set: data
            }
            const result = await petservices.updateOne(query, updateServices)
            res.send(result)

        })

        // for Delete an item
        app.delete("/delete/:id", async (req, res) => {
            const id = req.params;
            const query = { _id: new ObjectId(id) };
            const result = await petservices.deleteOne(query)
            res.send(result)
        })

        app.post('/orders', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await orderCollection.insertOne(data);
            res.status(201).send(result)
        })

        app.get('/orders', async (req, res) => {
            const result = await orderCollection.find().toArray();
            res.status(200).send(result)
        })

        // await client.db("admin").command({ ping: 1 });
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
const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port = process.env.Port || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1luet9i.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
   try{
    const brandCollection = client.db('cellIt').collection('brandOptions');
    const categoryCollection = client.db('cellIt').collection('categories');

    app.get('/brands', async(req, res)=>{
            const query = {}
            const cursor = brandCollection.find(query);
            const brands = await cursor.toArray();
            res.send(brands)
    })

    app.get('/categories', async(req, res)=>{
            const query = {}
            const cursor = categoryCollection.find(query);
            const brands = await cursor.toArray();
            res.send(brands)
    })

    // app.get('/category',async(req,res)=>{
    //     const categoryId= req.query.categoryId;
    //     const query = {categoryId: categoryId};
    //     const brands = await brandCollection.find(query).toArray();
    //        console.log(brands);
    //     res.send(brands);
    // })

   }
   finally{}
}
run().catch(error => console.error(error));



app.get('/', (req,res)=>{
    res.send('resale server is running')
})

app.listen(port, ()=>{
    console.log(`resale server running on ${port}`);
})
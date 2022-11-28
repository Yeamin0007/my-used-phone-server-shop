const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.Port || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1luet9i.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next){
    console.log('token gg', req.headers.authorization);
    const authHeader = req.headers.authorization;
    if(!authHeader){
        res.status(401).send({message: 'unauthorized access'})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
        if(err){
            return res.status(401).send({message: 'unsuthorized access'})
        }
        req.decoded = decoded;
        next();
    })
}

async function run(){
   try{
    const brandCollection = client.db('cellIt').collection('brandOptions');
    const categoryCollection = client.db('cellIt').collection('categories');
    const ordersCollection = client.db('cellIt').collection('orders');
    const buyersCollection = client.db('cellIt').collection('buyers');

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

    app.get('/brands/:categoryId', async (req, res) => {
        const categoryId = req.params.categoryId;
        const query = { categoryId: categoryId };
        const cursor = brandCollection.find(query);
        const category = await cursor.toArray();
        res.send(category);
    });

    app.get('/orders',  async(req, res) =>{
        const email = req.query.email;
        console.log(req.headers.authorization);
        // const decodedEmail = req.decoded.email;

        // if(email !== decodedEmail){
        //     return res.status(403).send({message: 'forbidden access'});
        // }

        const query = { email: email };
        const cursor = ordersCollection.find(query);
        const order = await cursor.toArray();
        res.send(order)
})

    app.post('/orders', async (req, res) => {
        const booking = req.body;
        const result = await ordersCollection.insertOne(booking);
        res.send(result);
    })

    app.get('/jwt', async(req, res) =>{
        const email = req.query.email;
        const query ={email: email};
        const user = await buyersCollection.findOne(query);
        if(user){
            const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '1h'})
            return res.send({accessToken: token});
        }
        res.status(403).send({accessToken: ''})
    })

    app.get('/buyers', async(req, res) =>{
        const query = {};
        const result = await buyersCollection.find(query).toArray();
        res.send(result);
    } )

    app.post('/buyers', async(req, res) =>{
        const user = req.body;
        const result = await buyersCollection.insertOne(user);
        res.send(result);
    })



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
const express = require("express");
let bodyParser = require('body-parser')
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
const { ObjectID } = require("bson");
const jsonParser = express.json();
let cors = require('cors')
let app = express();
let db;



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
let artists = [
    {
        id:1,
        name:'Iv'
    },
    {
        id:2,
        name:'Iva'
    },
    {
        id:3,
        name:'Ivn'
    }
]

app.get('/',function(req,res){
    res.send('Hello API')
})
app.get('/artists',function(req,res){
    const collection = req.app.locals.collection;
    collection.find().toArray(function (err,docs){
        if(err){
            console.log(err);
            return res.sendStatus(500)
        }
        res.send(docs)
    })
})
app.get('/artists/:id',function(req,res){
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOne({_id: id}, function(err, user){   
        if(err) return console.log(err);
        res.send(user);
    });
})

app.post('/artists',jsonParser,function(req,res){
    let artist = {
        name:req.body.name
    }
    const collection = req.app.locals.collection;
    collection.insertOne(artist,function (err,result){
        if(err){
            console.log(err);
            res.sendStatus(500);
        }
        res.send(artist)
    })
})

app.put('/artists/:id',function(req,res){
    if(!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const userName = req.body.name;
    const userAge = req.body.age;
       
    const collection = req.app.locals.collection;
    collection.findOneAndUpdate({_id: id}, { $set: {name: userName}},
         {returnOriginal: false },function(err, result){
        if(err) return console.log(err);     
        const user = result.value;
        //res.send(user);
        res.sendStatus(200);
    });

    
})

app.delete('/artists/:id',function(req,res){
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    collection.findOneAndDelete({_id: id}, function(err, result){
               
        if(err) return console.log(err);    
        let user = result.value;
        res.send(user);
    });
})
const mongoClient = new MongoClient("mongodb://localhost:27017/tasks", { useUnifiedTopology: true });
mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    db = client;
    app.locals.collection = client.db("tasks").collection("tasks");
    app.listen(3000, function(){
        console.log("Сеn  рвер ожидает подключения...");
    });
});
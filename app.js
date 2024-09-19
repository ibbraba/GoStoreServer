const express = require('express')
const { getAllProducts } = require('./Products/ProductController')
const { connectToMongo } = require('./dbGoStore_utils');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
require('dotenv').config();
const bcryptjs = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;
const app = express()
const port = 3000

//Allow CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//Decode JSON POST requests
app.use(bodyParser.json())

//Public endpoints 
app.get('/', (req, res) => {
    res.send('Hello World!')
})




//Find all products
app.get("/products", (req, res) => {
    connectToMongo("GoStoreDB", "Products")
        .then((collection) => {
            console.log(collection);

            return collection.find({}).toArray()
        }).then(products => {
            res.json(products)
        })
        .catch((error) => {
            console.log(error);

        })


})

//Finds a single product
app.get("/product/:id", (req, res) => {
    let id = req.params.id

    connectToMongo("GoStoreDB", "Products")
        .then((collection) => {
            console.log(collection);

            return collection.findOne({ "_id": new ObjectId(id) })
                .then(products => {
                    res.json(products)
                })
        })
        .catch((error) => {
            console.log(error);

        })
})

//Login a user
app.post("/login", (req, res) => {


    console.log("POST method received");


    let username = req.body.username
    let password = req.body.password


    connectToMongo("GoStoreDB", "Users")
        .then(collection => {
            return collection.findOne({
                "username": username,
              
            })

        }).then((user) => {
            if(user && bcryptjs.compare(req.body.password, user.password)){
                console.log("User connected, creating token and redirecting ...");
                const token = jwt.sign( { 
                userId: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '2h', 
                algorithm : "HS256" }
                );
           
                res.send(token);
            }else{
                res.status(401).send({
                    message : "Identifiants invalides"
                });
            }
           
            
        })
        .catch((err) =>{
            console.log(err)
            res.json({ "message": "Une erreur est survenue" })
        })
        
            
})

//register a user   
app.post('/register', (req, res) => {
    console.log("Register request received");


    let role = "Member"
    let username = req.body.username
    let password =  bcryptjs.hash(req.body.password, 10); // hashage du mot de passe
    let name = req.body.name
    let firstname = req.body.firstname
    let email = req.body.email
    let adress = req.body.adress
    let zipcode = req.body.zipcode
    let country = req.body.country
    let gopoints = 0

    //TODO : Validation 

    connectToMongo("GoStoreDB", "Users")
        .then(collection => {
            collection.insertOne({
                "username": username,
                "password" : password,
                "name": name,
                "firstname": firstname,
                "email": email,
                "adress": adress,
                "zipcode": zipcode,
                "country": country,
                "gopoints": gopoints
            })
        }).then(() => {
            res.json({ "message": "Utilisateur enregistré" })
        }).catch((err) => console.log(err));

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


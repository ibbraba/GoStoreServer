const express = require('express')
const { getAllProducts } = require('./Products/ProductController')
const { connectToMongo } = require('./dbGoStore_utils')
const ObjectId = require('mongodb').ObjectId;
const app = express()
const port = 3000



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


app.post("/login", (req, res) => {

    //TODO : Debug method
    let username = req.body.username
    let password = req.body.password

    connectToMongo("GoStoreDB", "Users")
    .then(collection => {
        return collection.findOne({
            "username": username,
            "password": password
        })
        .then((user) => {
            res.json(user)
        })
    }).catch((err) => {console.log(err)})
})
    
    //register a user   
    app.post('/register', (req, res) => {
        let role = "Member"
        let username = req.body.username
        let password = req.body.password
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


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
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
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


            return collection.findOne({ "_id": new ObjectId(id) })
                .then(product => {
                    res.json(product)
                })
        })
        .catch((error) => {
            console.log(error);

        })
})

//Gets commands for a given user
//TODO edit request 
app.get("/commands/:id", (req, res) => {

    let id = req.params.id
    connectToMongo("GoStoreDB", "Commands")
        .then((collection) => {
            console.log(collection)
            return collection.find({}).toArray()
        }).then((commands) => {
            console.log(commands);

            res.json({ commands })
        }).catch((err) => {
            console.log(err);

        })
})

app.get("/command/:id", (req, res) => {
    let id = req.params.id
    connectToMongo("GoStoreDB", "Commands")
        .then((collection) => {
            return collection.findOne({ "_id": new ObjectId(id) })
                .then(products => {
                    res.json(products)
                })

        }).catch((err) => console.log(err))
})

app.get("/command/validate/:id", (req, res) => {
    let id = req.params.id
    connectToMongo("GoStoreDB", "Commands")
        .then((collection) => {
            collection.updateOne({ "_id": new ObjectId(id) },
                {
                    $set: {
                        "validated": true
                    }
                }
            )
        }).then(() => {
            res.send("La commande a bien été validée")
        }).catch((err) => {
            console.log(err);
            
        })
})


app.post("/create-command", (req, res) => {
    console.log(req.body);

    const command = req.body
    connectToMongo("GoStoreDB", "Commands")
        .then((collection) => {
            collection.insertOne(command)
        }).then(() => {
            res.json({ "message": "Commande enregistrée" })
        }).catch((err) => {
            console.log(err);

        })

})


//Find a user data
app.get("/user/:id", (req, res) => {
    let id = req.params.id

    connectToMongo("GoStoreDB", "Users")
        .then((collection) => {

            return collection.findOne({ "_id": new ObjectId(id) })
                .then(user => {
                    res.json({
                        "id": user._id,
                        "username": user.username,
                        "name": user.name,
                        "email": user.email,
                        "adress": user.adress,
                        "zipcode": user.zipcode,
                        "country": user.country,
                        "gopoints": user.gopoints
                    })
                })
        })
        .catch((error) => {
            console.log(error);

        })
})

app.post("/user/edit/:id", (req, res) => {

    //Collect request informations
    let id = req.params.id
    let name = req.body.name
    let firstname = req.body.firstname
    let email = req.body.email
    let adress = req.body.adress
    let zipcode = req.body.zipcode
    let country = req.body.country

    connectToMongo("GoStoreDB", "Users")
        .then(collection => {
            return collection.updateOne({ "_id": new ObjectId(id) },
                {
                    $set: {
                        "name": name,
                        "firstname": firstname,
                        "email": email,
                        "adress": adress,
                        "zipcode": zipcode,
                        "country": country
                    }
                }
            )
        }).then(() => {
            res.send("user updated")
        }).catch((err) => {
            console.log(err);

        })

})

//Login a user
app.post("/login", (req, res) => {


    let username = req.body.username
    let password = req.body.password


    connectToMongo("GoStoreDB", "Users")
        .then(collection => {
            return collection.findOne({
                "username": username,

            })

        }).then(async (user) => {



            //Invalid username 
            if (!user) {
                res.status(401).send({
                    message: "Identifiants invalides"
                });

                return
            }

            //Compare passwords
            if (user && await bcryptjs.compare(req.body.password, user.password)) {

                //Creating a JWT
                const token = jwt.sign({
                    userId: user._id, username: user.username
                },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: '2h',
                        algorithm: "HS256"
                    }
                );

                //Sending response
                res.json({
                    "message": "success",
                    "token": token,
                    "user": {
                        "id": user._id,
                        "username": user.username,
                        "name": user.name,
                        "email": user.email,
                        "adress": user.adress,
                        "zipcode": user.zipcode,
                        "country": user.country,
                        "gopoints": user.gopoints
                    }
                });
            } else {
                //Invalid password
                res.status(401).send({
                    message: "Identifiants invalides"
                });
            }


        })
        .catch((err) => {
            console.log(err)

        })


})

//register a user   
app.post('/register', async (req, res) => {
    console.log("Register request received");


    let role = "Member"
    let username = req.body.username
    //Hash password
    let password = await bcryptjs.hash(req.body.password, 10);
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
                "password": password,
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

//Checks a token validity
app.get("/verify", (req, res) => {

    const token = req.headers.authorization;

    //No token
    if (!token) {
        console.log("Missing token");
        res.send("Missing token ")
        return
    }

    //Validate token signature
    const tokenVerification = jwt.verify(token, process.env.JWT_SECRET, (err, decodedtoken) => {

        if (err) {
            console.log(err.message);

            return err.message

        } else {
            return true
        }
    })
    res.send(tokenVerification)

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


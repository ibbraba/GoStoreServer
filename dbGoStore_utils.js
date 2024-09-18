const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });


exports.connectToMongo = connectToMongo



async function connectToMongo(dbName, collectionName) {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connecté à MongoDB");
        return client.db(dbName).collection(collectionName);
    } catch (error) {
        console.error('Erreur de connexion à MongoDB:', error);
        throw error;
    }
}

function findAllTasks(collection) {
    return collection.find({}).toArray();
}




const { Collection } = require("mongodb");
const { connectToMongo } = require("../dbGoStore_utils");

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });


exports.getAllProducts = getAllProducts

function getAllProducts(){
    // connect to DB 
    connectToMongo("GoStoreDB", "Products")
    .then((collection) => {
        console.log(collection);
        
        return collection.find({}).toArray()
    }).catch((error) => {
        console.log(error);
        
    })


}
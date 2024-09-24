import { describe, expect, it, test } from "vitest";
const request = require('supertest');



import { application, request } from "express";
import { app } from "./app";
import request from 'supertest';


describe("It ensure the right behaviour of endpoints", () => {

   

    it("return 200 on get products", async() => {
        const res = await request(app).get("/products")
        expect(res.status).toBe(200)
            
    })


    it("Return 404 on not found endpoint", async ()=> {
    
        const res = await request(app)
        .get('/notavalidroute')
    
        expect(res.status).toBe(404)
        
    })

    it("ensures 401 status code if invalid credentials", async() => {

        const res = await request(app).post('/login').send({
            "username" : "username", 
            "password" : "invalidValue"
        })

        expect(res.status).toBe(401)

    })

    it("Ensures verify invalidates a wrong token", async()=> {

    
        let invaldToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmViZWYyOWRkNTJjOWI1Nzk4YzQxMWMiLCJ1c2VybmFtZSI6ImJjcnlwdCIsImlhdCI6MTcyNzAzMTQxNywiZXhwIjoxNzI3MDM4NjE3fQ.AOczPbYeHBxBdBHuEYRcXww8qL1a4VKcDuBkQLLunN0"
        const res = await request(app).get('/verify').set('Authorization', `Bearer ${invaldToken}`);

        expect(res.status).toBe(401)
    })



})



import { expect, test } from "vitest";

import { application, request } from "express";

test("Return 404 on not found endpoint", ()=> {
    
    request(app())
    .get('/session/new')
    .expect('GET', "test")
})
const request = require("supertest");
const server = require("../index");

const testUser = {
  email: "test@test.com",
  password: "Password1!",
};

describe("POST /api/v1/auth/signup", () => {
  it("should response with 200 status code", (done) => {
    request(server)
      .post("/api/v1/auth/signup")
      .send(testUser)
      .set("Accept", "application/json")
      .then((res) => {
        console.log(res.body.data.user)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
          code: 200,
          status: "success",
          message: "Sign up successfully",
          data: expect.toEqual({
            user:{
              email: "test@test.com",
              address: null,
              avatar: null,
              birthdate: null,
              driver_license: null,
              fullname: null,
              gender: null,
              phone_number: null,
              roleId: 3,
              createdBy: null,
              createdDt: expect.any(String),
              updatedBy: null,
              updatedDt: expect.any(String)
          }})
        })
        done()
      })
      .catch(e => {
        console.log(e)
        done()
      })
  })
  it("should response with 400 status code", (done) => {
    request(server)
      .post("/api/v1/auth/signup")
      .send(testUser)
      .set("Accept", "application/json")
      .then((res) => {
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
          code: 200,
          status: "success",
          message: "Sign up successfully",
          data: expect.toEqual({
            user:{
              email: "test@test.com",
              address: null,
              avatar: null,
              birthdate: null,
              driver_license: null,
              fullname: null,
              gender: null,
              phone_number: null,
              roleId: 3,
              createdBy: null,
              createdDt: expect.any(String),
              updatedBy: null,
              updatedDt: expect.any(String)
          }})
        })
        done()
      })
  })
})

describe("POST /api/v1/auth/signin", () => {
  it("should response with 200 status code", (done) => {
    request(server)
      .post("/api/v1/auth/signin")
      .send(testUser)
      .set("Accept", "application/json")
      .then((res) => {
        console.log(res.body.data.user)
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
          code: 200,
          status: "success",
          message: "Sign in successfully",
          data: expect.objectContaining({
            token: expect. any(String),
            user:{
              email: "test@test.com",
              address: null,
              avatar: null,
              birthdate: null,
              driver_license: null,
              fullname: null,
              gender: null,
              phone_number: null,
              roleId: 3,
              createdBy: null,
              createdDt: expect.any(String),
              updatedBy: null,
              updatedDt: expect.any(String)
          }})
        })
        done()
      })
      .catch(e => {
        console.log(e)
        done()
      })
  })
})

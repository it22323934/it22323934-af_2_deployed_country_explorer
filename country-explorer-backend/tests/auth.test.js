import request from "supertest";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import {app,server} from "../index.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcryptjs from "bcryptjs";

let mongoServer;

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_TEST_URI = uri;
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
    server.close();
});

/**
 * Authentication tests
 */

/**
 * POST /api/auth/signup
 * POST /api/auth/signin
 * POST /api/auth/google
 */

/**
 * Signup
 * 1. Register a new user
 * 2. Return 400 if any field is missing
 * 3. Return 409 if email is already registered
 * 4. Return 409 if username is already taken
 * 5. Return 500 if there's an error
 */
describe("POST /api/auth/signup", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "Signup successful");

    const user = await User.findOne({ email: "testuser@example.com" });
    expect(user).toBeTruthy();
    expect(user.username).toBe("testuser");
    expect(user.email).toBe("testuser@example.com");
  });

  it("should return 400 if any field is missing", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "missingpassword@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe("All fields are required");
  });
});

/**
 * Signin
 * 1. Sign in an existing user
 * 2. Return 404 if the user is not found
 * 3. Return 401 for invalid password
 * 4. Return 500 if there's an error
 * 5. Return 200 with user details and cookie
 * 6. Return 401 for invalid credentials
 * 7. Return 500 if there's an error
 * 8. Return 200 with user details and cookie
 * 9. Register a new user using Google OAuth
 * 10. Return 500 if there's an error
 * 11. Return 200 with user details and cookie
 * 12. Return 404 if the user is not found
 */
describe("POST /api/auth/signin", () => {
  beforeAll(async () => {
    const hashedPassword = bcryptjs.hashSync("password123", 10);
    await User.create({
      username: "existinguser",
      email: "existinguser@example.com",
      password: hashedPassword,
    });
  });

  it("should sign in an existing user", async () => {
    const res = await request(app).post("/api/auth/signin").send({
      email: "existinguser@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("username", "existinguser");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("should return 404 if the user is not found", async () => {
    const res = await request(app).post("/api/auth/signin").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe("User not registered");
  });

  it("should return 401 for invalid password", async () => {
    const res = await request(app).post("/api/auth/signin").send({
      email: "existinguser@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe("Invalid credentials");
  });
});

/**
 * Google OAuth
 * 1. Authenticate or register a user using Google OAuth
 * 2. Return 200 with user details and cookie
 * 3. Return 500 if there's an error
 * 4. Return 200 with user details and cookie
 */
describe("POST /api/auth/google", () => {
  it("should authenticate or register a user using Google OAuth", async () => {
    const res = await request(app).post("/api/auth/google").send({
      email: "googleuser@example.com",
      name: "Google User",
      googlePhotoURL: "http://example.com/photo.jpg",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("email", "googleuser@example.com");
    expect(res.body).toHaveProperty("username");

    const user = await User.findOne({ email: "googleuser@example.com" });
    expect(user).toBeTruthy();
  });
});


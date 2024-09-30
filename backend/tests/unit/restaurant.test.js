// tests/restaurantRoutes.test.js

const request = require("supertest");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../schemas/restaurant");

const Restaurant = require("../../schemas/restaurant");

const router = require("../../routes/restaurantRoutes");

const app = express();
app.use(express.json());
app.use("/", router);

describe("Restaurant Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /register", () => {
    it("should register a new restaurant successfully", async () => {
      Restaurant.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashedPassword");
      const mockSave = jest.fn().mockResolvedValue();
      Restaurant.mockImplementation(() => ({
        save: mockSave,
      }));

      const res = await request(app).post("/register").send({
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "1234567890",
        restaurantName: "John's Diner",
        location: "123 Main St",
        password: "password123",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Restaurant registered successfully");
      expect(mockSave).toHaveBeenCalled();
    });

    it("should return 400 if restaurant already exists", async () => {
      Restaurant.findOne.mockResolvedValue({ phoneNumber: "1234567890" });

      const res = await request(app).post("/register").send({
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "1234567890",
        restaurantName: "John's Diner",
        location: "123 Main St",
        password: "password123",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Restaurant already exists");
    });

    it("should return 500 if there is a server error", async () => {
      Restaurant.findOne.mockRejectedValue(new Error("Database error"));

      const res = await request(app).post("/register").send({
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "1234567890",
        restaurantName: "John's Diner",
        location: "123 Main St",
        password: "password123",
      });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Server error");
    });
  });

  describe("POST /login", () => {
    it("should login successfully with correct credentials", async () => {
      const mockRestaurant = {
        _id: "restaurant_id",
        phoneNumber: "1234567890",
        password: "hashedPassword",
      };
      Restaurant.findOne.mockResolvedValue(mockRestaurant);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token");

      const res = await request(app).post("/login").send({
        phoneNumber: "1234567890",
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Login successful");
      expect(res.body.token).toBe("token");
    });

    it("should return 400 for invalid phone number", async () => {
      Restaurant.findOne.mockResolvedValue(null);

      const res = await request(app).post("/login").send({
        phoneNumber: "1234567890",
        password: "password123",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid phone number or password");
    });

    it("should return 400 for invalid password", async () => {
      const mockRestaurant = {
        _id: "restaurant_id",
        phoneNumber: "1234567890",
        password: "hashedPassword",
      };
      Restaurant.findOne.mockResolvedValue(mockRestaurant);
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app).post("/login").send({
        phoneNumber: "1234567890",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid phone number or password");
    });

    it("should return 500 if there is a server error", async () => {
      Restaurant.findOne.mockRejectedValue(new Error("Database error"));

      const res = await request(app).post("/login").send({
        phoneNumber: "1234567890",
        password: "password123",
      });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Server error");
    });
  });

  describe("POST /restaurants/:restaurantId/items", () => {
    it("should add an item to a restaurant", async () => {
      const mockRestaurant = {
        _id: "restaurant_id",
        items: [],
        save: jest.fn().mockResolvedValue(),
      };
      Restaurant.findById.mockResolvedValue(mockRestaurant);

      const res = await request(app)
        .post("/restaurants/restaurant_id/items")
        .send({
          dishName: "New Dish",
          price: 15,
          description: "Delicious new dish",
          imageUrl: "http://example.com/image.jpg",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Item added successfully");
      expect(mockRestaurant.save).toHaveBeenCalled();
    });

    it("should return 404 if restaurant is not found", async () => {
      Restaurant.findById.mockResolvedValue(null);

      const res = await request(app)
        .post("/restaurants/restaurant_id/items")
        .send({
          dishName: "New Dish",
          price: 15,
          description: "Delicious new dish",
          imageUrl: "http://example.com/image.jpg",
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Restaurant not found");
    });

    it("should return 500 if there is a server error", async () => {
      Restaurant.findById.mockRejectedValue(new Error("Database error"));

      const res = await request(app)
        .post("/restaurants/restaurant_id/items")
        .send({
          dishName: "New Dish",
          price: 15,
          description: "Delicious new dish",
          imageUrl: "http://example.com/image.jpg",
        });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Server error");
    });
  });

  describe("GET /restaurants/:restaurantId/items", () => {
    it("should return all items for a restaurant", async () => {
      const mockRestaurant = {
        _id: "restaurant_id",
        items: [
          { dishName: "Dish 1", price: 10 },
          { dishName: "Dish 2", price: 15 },
        ],
      };
      Restaurant.findById.mockResolvedValue(mockRestaurant);

      const res = await request(app).get("/restaurants/restaurant_id/items");

      expect(res.statusCode).toBe(200);
      expect(res.body.items).toEqual(mockRestaurant.items);
    });

    it("should return 404 if restaurant is not found", async () => {
      Restaurant.findById.mockResolvedValue(null);

      const res = await request(app).get("/restaurants/restaurant_id/items");

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Restaurant not found");
    });

    it("should return 500 if there is a server error", async () => {
      Restaurant.findById.mockRejectedValue(new Error("Database error"));

      const res = await request(app).get("/restaurants/restaurant_id/items");

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Server error");
    });
  });

  describe("GET /restaurants/:restaurantId/items/:itemId", () => {
    it("should return a specific item for a restaurant", async () => {
      const mockItem = { _id: "item_id", dishName: "Dish 1", price: 10 };
      const mockRestaurant = {
        _id: "restaurant_id",
        items: [mockItem],
      };
      Restaurant.findById.mockResolvedValue(mockRestaurant);

      const res = await request(app).get(
        "/restaurants/restaurant_id/items/item_id"
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.item).toEqual(mockItem);
    });

    it("should return 404 if restaurant is not found", async () => {
      Restaurant.findById.mockResolvedValue(null);

      const res = await request(app).get(
        "/restaurants/restaurant_id/items/item_id"
      );

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Restaurant not found");
    });

    it("should return 404 if item is not found", async () => {
      const mockRestaurant = {
        _id: "restaurant_id",
        items: [],
      };
      Restaurant.findById.mockResolvedValue(mockRestaurant);

      const res = await request(app).get(
        "/restaurants/restaurant_id/items/item_id"
      );

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Item not found");
    });

    it("should return 500 if there is a server error", async () => {
      Restaurant.findById.mockRejectedValue(new Error("Database error"));

      const res = await request(app).get(
        "/restaurants/restaurant_id/items/item_id"
      );

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Server error");
    });
  });

  describe("PUT /restaurants/:restaurantId/items/:itemId", () => {
    it("should update an item for a restaurant", async () => {
      const mockItem = { _id: "item_id", dishName: "Dish 1", price: 10 };
      const mockRestaurant = {
        _id: "restaurant_id",
        items: [mockItem],
        save: jest.fn().mockResolvedValue(),
      };
      Restaurant.findById.mockResolvedValue(mockRestaurant);

      const res = await request(app)
        .put("/restaurants/restaurant_id/items/item_id")
        .send({
          dishName: "Updated Dish",
          price: 20,
          description: "Updated description",
          imageUrl: "http://example.com/updated-image.jpg",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Item updated successfully");
      expect(mockRestaurant.save).toHaveBeenCalled();
    });

    it("should return 404 if restaurant is not found", async () => {
      Restaurant.findById.mockResolvedValue(null);

      const res = await request(app)
        .put("/restaurants/restaurant_id/items/item_id")
        .send({
          dishName: "Updated Dish",
          price: 20,
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Restaurant not found");
    });

    it("should return 404 if item is not found", async () => {
      const mockRestaurant = {
        _id: "restaurant_id",
        items: [],
      };
      Restaurant.findById.mockResolvedValue(mockRestaurant);

      const res = await request(app)
        .put("/restaurants/restaurant_id/items/item_id")
        .send({
          dishName: "Updated Dish",
          price: 20,
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Item not found");
    });

    it("should return 500 if there is a server error", async () => {
      Restaurant.findById.mockRejectedValue(new Error("Database error"));

      const res = await request(app)
        .put("/restaurants/restaurant_id/items/item_id")
        .send({
          dishName: "Updated Dish",
          price: 20,
        });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Server error");
    });
  });

  describe("DELETE /restaurants/:restaurantId/items/:itemId", () => {
    it("should delete an item from a restaurant", async () => {
      const mockItem = { _id: "item_id", dishName: "Dish 1", price: 10 };
      const mockRestaurant = {
        _id: "restaurant_id",
        items: [mockItem],
        save: jest.fn().mockResolvedValue(),
      };
      Restaurant.findById.mockResolvedValue(mockRestaurant);

      const res = await request(app).delete(
        "/restaurants/restaurant_id/items/item_id"
      );

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Item deleted successfully");
      expect(mockRestaurant.save).toHaveBeenCalled();
    });

    it("should return 404 if restaurant is not found", async () => {
      Restaurant.findById.mockResolvedValue(null);

      const res = await request(app).delete(
        "/restaurants/restaurant_id/items/item_id"
      );

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Restaurant not found");
    });

    it("should return 404 if item is not found", async () => {
      const mockRestaurant = {
        _id: "restaurant_id",
        items: [],
      };
      Restaurant.findById.mockResolvedValue(mockRestaurant);

      const res = await request(app).delete(
        "/restaurants/restaurant_id/items/item_id"
      );

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Item not found");
    });

    it("should return 500 if there is a server error", async () => {
      Restaurant.findById.mockRejectedValue(new Error("Database error"));

      const res = await request(app).delete(
        "/restaurants/restaurant_id/items/item_id"
      );

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Server error");
    });
  });
});

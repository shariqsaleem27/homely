// tests/userRoutes.test.js

const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../schemas/user');
jest.mock('../schemas/restaurant');
jest.mock('../schemas/cart');
jest.mock('../schemas/order');

const User = require('../../schemas/user');
const Restaurant = require('../../schemas/restaurant');
const Cart = require('../../schemas/cart');
const Order = require('../../schemas/order');

const router = require('../../routes/userRoutes'); // Adjust the path as needed

const app = express();
app.use(express.json());
app.use('/', router);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      User.findOne.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      const mockSave = jest.fn().mockResolvedValue();
      User.mockImplementation(() => ({
        save: mockSave,
      }));

      const res = await request(app)
        .post('/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '1234567890',
          email: 'john@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
      expect(mockSave).toHaveBeenCalled();
    });

    it('should return 400 if user already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'john@example.com' });

      const res = await request(app)
        .post('/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '1234567890',
          email: 'john@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('User already exists');
    });
  });

  describe('POST /login', () => {
    it('should login successfully with correct credentials', async () => {
      const mockUser = {
        _id: 'user_id',
        email: 'john@example.com',
        password: 'hashedPassword',
      };
      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');

      const res = await request(app)
        .post('/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Login successful');
      expect(res.body.token).toBe('token');
    });

    it('should return 400 for invalid credentials', async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid email or password');
    });
  });

  describe('GET /items', () => {
    it('should return all items from all restaurants', async () => {
      const mockRestaurants = [
        { restaurantName: 'Restaurant 1', items: [{ name: 'Item 1' }] },
        { restaurantName: 'Restaurant 2', items: [{ name: 'Item 2' }] },
      ];
      Restaurant.find.mockResolvedValue(mockRestaurants);

      const res = await request(app).get('/items');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockRestaurants);
    });
  });

  describe('POST /cart', () => {
    it('should add an item to the cart', async () => {
      const mockCart = {
        userId: 'user_id',
        items: [],
        totalAmount: 0,
        save: jest.fn().mockResolvedValue(),
      };
      Cart.findOne.mockResolvedValue(mockCart);

      const res = await request(app)
        .post('/cart')
        .send({
          userId: 'user_id',
          restaurantId: 'restaurant_id',
          dishName: 'Pizza',
          price: 10,
          quantity: 2,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Item added to cart');
      expect(mockCart.save).toHaveBeenCalled();
    });

    it('should create a new cart if it doesn\'t exist', async () => {
      Cart.findOne.mockResolvedValue(null);
      const mockSave = jest.fn().mockResolvedValue();
      Cart.mockImplementation(() => ({
        save: mockSave,
      }));

      const res = await request(app)
        .post('/cart')
        .send({
          userId: 'user_id',
          restaurantId: 'restaurant_id',
          dishName: 'Pizza',
          price: 10,
          quantity: 2,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Item added to cart');
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('GET /cart/:userId', () => {
    it('should return the cart for a user', async () => {
      const mockCart = {
        userId: 'user_id',
        items: [{ dishName: 'Pizza', price: 10, quantity: 2 }],
        totalAmount: 20,
      };
      Cart.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockCart),
      });

      const res = await request(app).get('/cart/user_id');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockCart);
    });

    it('should return 404 if cart is not found', async () => {
      Cart.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      const res = await request(app).get('/cart/user_id');

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Cart not found');
    });
  });

  describe('POST /order', () => {
    it('should place an order successfully', async () => {
      const mockOrder = {
        userId: 'user_id',
        items: [{ dishName: 'Pizza', price: 10, quantity: 2, totalPrice: 20 }],
        totalAmount: 20,
        deliveryAddress: '123 Main St',
        status: 'Pending',
        paymentStatus: 'Unpaid',
        save: jest.fn().mockResolvedValue(),
      };
      Order.mockImplementation(() => mockOrder);
      Cart.findOneAndUpdate.mockResolvedValue();

      const res = await request(app)
        .post('/order')
        .send({
          userId: 'user_id',
          items: [{ dishName: 'Pizza', price: 10, quantity: 2, totalPrice: 20 }],
          deliveryAddress: '123 Main St',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Order placed successfully');
      expect(res.body.order).toEqual(mockOrder);
      expect(Cart.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: 'user_id' },
        { items: [], totalAmount: 0 }
      );
    });
  });

  describe('GET /orders/:userId', () => {
    it('should return orders for a user', async () => {
      const mockOrders = [
        { _id: 'order1', status: 'Pending' },
        { _id: 'order2', status: 'Delivered' },
      ];
      Order.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockOrders),
      });

      const res = await request(app).get('/orders/user_id');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockOrders);
    });

    it('should return 404 if no orders are found', async () => {
      Order.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      const res = await request(app).get('/orders/user_id');

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('No orders found');
    });
  });
});
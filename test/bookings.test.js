const request = require('supertest');
const { app, server, shutdownServer } = require('../app');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
require('dotenv').config();

// Mock db conn
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_CONN_STRING);
});

afterEach(async () => {
  await Booking.deleteMany({});
});

afterAll(async () => {
  await shutdownServer();
  await mongoose.connection.close();
});

describe('POST /api/bookings', () => {
  it('should create a new booking', async () => {
    const bookingData = {
      pickupLocation: 'test case1 pickup',
      dropoffLocation: 'test case1 drop',
      vanType: 'medium',
      deliveryTime: new Date(),
      userId: 'user123',
    };

    const res = await request(app)
      .post('/api/bookings')
      .send(bookingData)
      .expect(201);

    // expect(res.body).toHaveProperty('_id');
    // expect(res.body.pickupLocation).toBe(bookingData.pickupLocation);
  });

  it('should return 400 Bad Request if required fields are missing', async () => {
    const invalidBookingData = {
      // Missing pickupLocation
      dropoffLocation: 'test case1',
      vanType: 'medium',
      deliveryTime: new Date(),
      userId: 'user123',
    };

    const res = await request(app)
      .post('/api/bookings')
      .send(invalidBookingData)
      .expect(400);

    expect(res.body.error).toBe('All fields are required');
  });

  it('should return 400 Bad Request if vanType is invalid', async () => {
    const invalidBookingData = {
      pickupLocation: 'test case1',
      dropoffLocation: 'test case1',
      vanType: 'invalid', // Invalid vanType
      deliveryTime: new Date(),
      userId: 'user123',
    };

    const res = await request(app)
      .post('/api/bookings')
      .send(invalidBookingData)
      .expect(400);

    expect(res.body.error).toBe('Invalid van type');
  });
});

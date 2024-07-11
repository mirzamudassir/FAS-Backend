const request = require('supertest');
const { app, server, shutdownServer } = require('../app');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
require('dotenv').config();

// Mock db conn
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_CONN_STRING);
});

// afterEach(async () => {
//   await Booking.deleteMany({});
// });

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
});

describe('POST /api/bookings', () => {
  it('should create a new booking', async () => {
    const bookingData = {
      pickupLocation: 'test case1 pickup',
      dropoffLocation: 'test case2 pickup',
      vanType: 'medium',
      deliveryTime: '2024-07-12T10:30:00.000Z',
      userId: '60d0fe4f5311236168a109ca',
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
      dropoffLocation: '123 Main St',
      vanType: 'medium',
      deliveryTime: '2024-07-12T10:30:00.000Z',
      userId: '60d0fe4f5311236168a109ca',
    };

    const res = await request(app)
      .post('/api/bookings')
      .send(invalidBookingData)
      .expect(400);

    expect(res.body.error).toBe('All fields are required');
  });

  it('should return 400 Bad Request if vanType is invalid', async () => {
    const invalidBookingData = {
      pickupLocation: '123 Main St',
      dropoffLocation: '456 Elm St',
      vanType: 'invalid', // Invalid vanType
      deliveryTime: '2024-07-12T10:30:00.000Z',
      userId: '60d0fe4f5311236168a109ca',
    };

    const res = await request(app)
      .post('/api/bookings')
      .send(invalidBookingData)
      .expect(400);

    expect(res.body.error).toBe('Invalid van type');
  });
});

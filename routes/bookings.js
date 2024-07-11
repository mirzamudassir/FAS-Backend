const express = require('express');
const Booking = require('../models/Booking');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - pickupLocation
 *         - dropoffLocation
 *         - vanType
 *         - deliveryTime
 *         - userId
 *       properties:
 *         pickupLocation:
 *           type: string
 *           description: Pickup location
 *         dropoffLocation:
 *           type: string
 *           description: Dropoff location
 *         vanType:
 *           type: string
 *           enum: [small, medium, large]
 *           description: Type of the van
 *         deliveryTime:
 *           type: string
 *           format: date-time
 *           description: Desired delivery time
 *         userId:
 *           type: string
 *           description: ID of the user making the booking
 *       example:
 *         pickupLocation: "Test location"
 *         dropoffLocation: "test drop location"
 *         vanType: "medium"
 *         deliveryTime: "2024-07-12T10:30:00.000Z"
 *         userId: "60d0fe4f5311236168a109ca"
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new delivery booking
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */


router.post('/bookings', async (req, res) => {
  const { pickupLocation, dropoffLocation, vanType, deliveryTime, userId } = req.body;

  // Validate input
  if (!pickupLocation || !dropoffLocation || !vanType || !deliveryTime || !userId) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!['small', 'medium', 'large'].includes(vanType)) {
    return res.status(400).json({ error: 'Invalid van type' });
  }

  try {
    // Create and save the booking
    const booking = new Booking({
      pickupLocation,
      dropoffLocation,
      vanType,
      deliveryTime,
      userId,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

//export
module.exports = router;

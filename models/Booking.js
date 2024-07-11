const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    vanType: {
      type: String,
      required: true,
      enum: ["small", "medium", "large"],
    },
    deliveryTime: { type: Date, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

//export
module.exports = mongoose.model("Booking", bookingSchema);

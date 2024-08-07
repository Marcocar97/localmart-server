const { Schema, model } = require("mongoose");
const reservationSchema = new Schema(
  {
    confirmationNumber: {
      type: String,
      required: true
    },
    createDate: { type: Date, default: Date.now },
    offer: {
      type: Schema.Types.ObjectId,
      ref: "Offer",
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  { timestamps: true }
);
const Reserva = model("Reservation", reservationSchema);
module.exports = Reserva;

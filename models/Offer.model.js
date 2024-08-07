const { Schema, model } = require("mongoose");
const offerSchema = new Schema(
  {
    offerName: { type: String, required: [true, "Offer name is required."] },
    description: { type: String, required: [true, "Description is required."] },
    availability: {
      type: String,
      required: [true, "Availability is required."],
    },
    schedules: { type: String, required: [true, "Schedules are required."] },
    image: { type: String },
    business: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: [true, "Business reference is required."],
    },
  },
  { timestamps: true }
);
const Offer = model("Offer", offerSchema);
module.exports = Offer;

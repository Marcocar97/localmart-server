const { Schema, model } = require("mongoose");
const businessSchema = new Schema(
  {
    businessName: {
      type: String,
      required: [true, "Business name is required."],
    },
    description: { type: String, required: [true, "Description is required."] },
    category: { type: String, required: [true, "Category is required."] },
    location: { type: String, required: [true, "Location is required."] },
    logo: { type: String },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, "Password is required."] },
  },
  { timestamps: true }
);
const Business = model("Business", businessSchema);

module.exports = Business;

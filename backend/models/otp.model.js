import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true }, // or phone number
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 },
  isVerified: { type: Boolean, default: false },
  // TTL index -> auto delete after 10 minutes
  otpExpire: { type: Date, required: true }, // manual expire check
});

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;

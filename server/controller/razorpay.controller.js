import User from "../models/user.model.js";
import crypto from "crypto"; // 1. Added missing crypto import
import razorpay from "../service/razerpay.service.js";
import Payment from "../models/razerpay.model.js";

export const createOrder = async (req, res) => {
  try {
    const { planId, amount, credits } = req.body;

    // Status 400 (Bad Request) is better for missing data than 500 (Internal Error)
    if (!amount || !credits) {
      return res.status(400).json({ message: "Invalid plan data" });
    }

    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`, // 2. Fixed spelling of 'receipt'
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      userId: req.userId, // Ensure req.userId is being set by your auth middleware!
      planId,
      amount,
      credits,
      razorpayOrderId: order.id,
      status: "created",
    });

    return res.status(200).json(order);
  } catch (error) {
    console.error("Create Order Error:", error);
    // 3. Fixed the string interpolation syntax from &{...} to ${...}
    return res
      .status(500)
      .json({ message: `Failed to create order: ${error.message}` });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Create the expected signature using your secret key
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Find the pending payment record
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    if (payment.status === "paid") {
      return res.status(400).json({ message: "Payment already processed" });
    }

    // Update payment status
    payment.status = "paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save();

    // Safely increment the user's credits
    const updateUser = await User.findByIdAndUpdate(
      payment.userId,
      {
        $inc: { credits: payment.credits }, // Assuming your User schema uses 'credit' and not 'credits'
      },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified and credits added successfully",
      user: updateUser,
      creditLeft: updateUser.credits,
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res
      .status(500)
      .json({ message: `Error occurred while verifying: ${error.message}` });
  }
};

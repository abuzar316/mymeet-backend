import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

const rzpAPIKey = "rzp_test_CdnLJ07GA4cFkT";
const rzpAPISecret = "tp2Ewp4mozCVDnwPIfUxhodK";

const instance = new Razorpay({
  key_id: rzpAPIKey,
  key_secret: rzpAPISecret,
});

router.post("/checkout", async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      receipt: "receipt#1",
    };

    const order = await instance.orders.create(options);

    res.status(200).send({ order });
  } catch (error) {
    res.status(400).send({ error });
  }
});

router.post("/payment/verification", async (req, res) => {
  try {
    res.status(200).send({ order: "" });
  } catch (error) {
    res.status(400).send({ error });
  }
});

router.get("/get/key", (req, res) => {
  res.status(200).send({ message: "success", rzpAPIKey });
});

export default router;

const d = {
  razorpay_order_id: "order_LlDcPeDW5xghZQ",
  razorpay_payment_id: "pay_LlDf9kJPzxa8TX",
  razorpay_signature:
    "85a7ae2fd4c652246d67e8b2a442f24da3a53ecd45705321caa5afb10e143510",
};

const c = {
  razorpay_order_id: "order_LlDi4DGsVrjeaf",
  razorpay_payment_id: "pay_LlDjRHIvOuEXE0",
  razorpay_signature:
    "409d3d2591d48a296c7fe341fee7cfd0c6f4ef4f3eddf6cdbace946a97cb439b",
};

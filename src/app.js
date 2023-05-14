import express from "express";
import paymentRoutes from "./routes/paymentRoutes.js";
import cors from "cors";

const app = express();

// use middleware
app.use(express.json());
app.use(express.urlencoded());
app.use(cors({ origin: "*" }));

app.use("/api/v1", paymentRoutes);

app.use((req, res) => {
  res.status(200).json({ message: "Page Not Found" });
});

export default app;

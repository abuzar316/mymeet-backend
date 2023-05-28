import express from "express";
import cors from "cors";

const app = express();

// use middleware
app.use(express.json());
// app.use(express.urlencoded());
app.use(cors({ origin: "*" }));

app.use("/", (req, res) => {
  res.status(200).json({ message: "server is running!" });
});

app.use((req, res) => {
  res.status(200).json({ message: "Page Not Found" });
});

export default app;

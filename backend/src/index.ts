import express from "express";
//import { testProducts } from "./data";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { productRouter } from "./routers/productRouter";
import testDataRouter from "./routers/testDataRouter";
import { userRouter } from "./routers/userRouter";
import { orderRouter } from "./routers/orderRouter";
import { keyRouter } from "./routers/keyRouter";
import couponRouter from "./routers/couponRouter";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/MERNshopSzakdogaDB";
mongoose.set("strictQuery", true);
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Mongodb csatlakozva");
  })
  .catch(() => {
    console.log("Mongodb hiba");
  });

const app = express();

app.use(express.json());

app.use(
  //cors middleware
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/testData", testDataRouter);
app.use("/api/orders", orderRouter);
app.use("/api/keys", keyRouter);
app.use("/api/coupons", couponRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Szerver fut: http://localhost:${PORT}`);
});

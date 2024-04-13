import express, { Request, Response } from "express";
import { ProductModel } from "../models/productModel";
import asyncHandler from "express-async-handler";
import { sampleUsers, testProducts } from "../data";
import { UserModel } from "../models/userModel";

export const testDataRouter = express.Router();

testDataRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    //await ProductModel.deleteMany({});
    const createdProducts = await ProductModel.insertMany(testProducts);

    //await UserModel.deleteMany({});
    const createdUsers = await UserModel.insertMany(sampleUsers);
    res.json({ createdProducts, createdUsers });
  })
);
export default testDataRouter;

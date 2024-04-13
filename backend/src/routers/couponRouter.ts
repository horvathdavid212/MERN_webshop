import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { CouponModel } from "../models/couponModel";
import { isAdmin, isAuth } from "../utils";

const couponRouter = express.Router();

// Get all coupons
couponRouter.get(
  "/admin/getAll",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const coupons = await CouponModel.find();
    res.json(coupons);
  })
);

// Get a single coupon
couponRouter.get(
  "/admin/getOne/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const coupon = await CouponModel.findById(req.params.id);
    if (!coupon) {
      res.status(404).json({ message: "Kuponkód nem található" });
    } else {
      res.json(coupon);
    }
  })
);

// Create a new coupon
couponRouter.post(
  "/admin/addNewCoupon",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { code, discount, expiryDate } = req.body;

    if (!code || discount <= 0 || new Date(expiryDate) <= new Date()) {
      res.status(400).json({ message: "Érvénytelen kuponkód" });
    } else {
      const coupon = new CouponModel({
        code,
        discount,
        expiryDate,
        isActive: true,
      });
      const savedCoupon = await coupon.save();
      res.status(201).json(savedCoupon);
    }
  })
);

// Update a coupon
couponRouter.put(
  "/admin/updateCoupon/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { code, discount } = req.body;
    const updatedCoupon = await CouponModel.findByIdAndUpdate(
      req.params.id,
      { code, discount },
      { new: true }
    );
    if (!updatedCoupon) {
      res.status(404).json({ message: "Kuponkód nem található" });
    } else {
      res.json(updatedCoupon);
    }
  })
);

// Delete a coupon
couponRouter.delete(
  "/admin/deleteCoupon/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const deletedCoupon = await CouponModel.findByIdAndDelete(req.params.id);
    if (!deletedCoupon) {
      res.status(404).json({ message: "Kuponkód nem található" });
    } else {
      res.json({ message: "Kuponkód törölve" });
    }
  })
);

// Post request to validate a coupon
couponRouter.post(
  "/validate",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { code } = req.body;
    const userId = req.user._id;

    const coupon = await CouponModel.findOne({
      code,
      isActive: true,
      expiryDate: { $gte: new Date() },
    });

    if (!coupon) {
      res
        .status(404)
        .json({ message: "Kuponkód nem található vagy már lejárt." });
    } else if (coupon.usersRedeemed.includes(userId)) {
      res.status(400).json({ message: "Ezt a kuponkódot már felhasználtad." });
    } else {
      res.json(coupon);
    }
  })
);

export default couponRouter;

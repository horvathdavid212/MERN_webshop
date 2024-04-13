import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { OrderModel } from "../models/orderModel";
import { Product } from "../models/productModel";
import { CouponModel } from "../models/couponModel";
import { isAuth, isAdmin } from "../utils";
export const orderRouter = express.Router();

// rendelések kezelése (ADMIN) -----------------------------------------------------

// Get all orders (Admin only)
orderRouter.get(
  "/admin/getAllOrders",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.find({}).populate("user", "name");
    res.json(orders);
  })
);

// Get order by id (Admin only)
orderRouter.get(
  "/admin/getOrder/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "A rendelés nem található" });
    }
  })
);

// Update order to delivered (Admin only)
orderRouter.put(
  "/admin/updateOrderToDelivered/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = new Date(Date.now());

      const updatedOrder = await order.save();
      res.json({
        order: updatedOrder,
        message: "Rendelés sikeresen teljesítve",
      });
    } else {
      res.status(404).json({ message: "A rendelés nem található" });
    }
  })
);

// Delete order (Admin only)
orderRouter.delete(
  "/admin/deleteOrder/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id);
    if (order) {
      await OrderModel.deleteOne({ _id: order._id });
      res.json({ message: "Rendelés törölve" });
    } else {
      res.status(404).json({ message: "A rendelés nem található" });
    }
  })
);

// -----------------------------------------------------

orderRouter.get(
  "/orderHistory",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.find({ user: req.user._id });
    res.json(orders);
  })
);

orderRouter.get(
  "/:id",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "A rendelés nem található" });
    }
  })
);

orderRouter.post(
  "/",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).json({ message: "Kosár üres" });
    } else {
      const { couponCode } = req.body;
      let discountPercentage = 0;

      if (couponCode) {
        console.log("couponCode: ", couponCode);
      } else console.log("couponCode: ", couponCode);

      if (couponCode) {
        const coupon = await CouponModel.findOne({
          code: couponCode,
          isActive: true,
          expiryDate: { $gte: new Date() },
          usersRedeemed: { $nin: [req.user._id] },
        });

        if (!coupon) {
          res
            .status(400)
            .json({ message: "Kuponkód nem található vagy már lejárt." });
        } else {
          discountPercentage = coupon.discount;

          const discountAmount = Math.floor(
            req.body.itemsPrice * (discountPercentage / 100)
          );

          const totalPrice =
            req.body.itemsPrice - discountAmount + req.body.shippingPrice;

          coupon.usersRedeemed.push(req.user._id);
          await coupon.save();

          const createdOrder = await OrderModel.create({
            orderItems: req.body.orderItems.map((x: Product) => ({
              ...x,
              product: x._id,
            })),
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            itemsPrice: req.body.itemsPrice,
            shippingPrice: req.body.shippingPrice,
            totalPrice: totalPrice,
            user: req.user._id,
            couponApplied: req.body.appliedCoupon,
          });

          res
            .status(201)
            .json({ message: "Rendelés sikeres", order: createdOrder });
        }
      } else {
        const totalPrice = req.body.itemsPrice + req.body.shippingPrice;

        const createdOrder = await OrderModel.create({
          orderItems: req.body.orderItems.map((x: Product) => ({
            ...x,
            product: x._id,
          })),
          shippingAddress: req.body.shippingAddress,
          paymentMethod: req.body.paymentMethod,
          itemsPrice: req.body.itemsPrice,
          shippingPrice: req.body.shippingPrice,
          totalPrice: totalPrice,
          user: req.user._id,
        });

        res
          .status(201)
          .json({ message: "Rendelés sikeres", order: createdOrder });
      }
    }
  })
);

orderRouter.put(
  "/:id/pay",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date(Date.now());
      order.paymentResult = {
        paymentId: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();

      res.json({
        order: updatedOrder,
        message: "Rendelés sikeresen kifizetve",
      });
    } else {
      res.status(404).send({ message: "A rendelés nem található" });
    }
  })
);

import { User, UserModel } from "../models/userModel";
import { generateToken, isAdmin, isAuth } from "../utils";
import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

export const userRouter = express.Router();

userRouter.post(
  "/signin",
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Helytelen email vagy jelszó" });
  })
);

userRouter.post(
  "/signup",
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    } as User);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.put(
  "/profile",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    }
  })
);

// kedvenc termék kezelése -----------------------------------------------------

userRouter.get(
  "/favorites",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.user._id).populate("favorites");

    if (user) {
      res.json(user.favorites);
    } else {
      res.status(404).send({ message: "Felhasználó nem található." });
    }
  })
);

userRouter.post(
  "/favorites/add",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.user._id);
    const { productId } = req.body;

    if (user && !user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
      res.json({ message: "Termék hozzáadva a kedvencekhez." });
    } else {
      res
        .status(404)
        .send({ message: "Felhasználó vagy termék nem található." });
    }
  })
);

userRouter.post(
  "/favorites/remove",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.user._id);
    const { productId } = req.body;

    if (user && user.favorites.includes(productId)) {
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== productId
      );
      await user.save();
      res.json({ message: "Termék eltávolítva a kedvencekből." });
    } else {
      res
        .status(404)
        .send({ message: "Felhasználó vagy termék nem található." });
    }
  })
);

// felhasználók kezelése (ADMIN)-------------------------------------------------------

// List all users (Admin only)
userRouter.get(
  "/admin/getAllUsers",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const users = await UserModel.find({});
    res.json(users);
  })
);

// Get user by id (Admin only)
userRouter.get(
  "/admin/getUser/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.params.id);
    res.json(user);
  })
);

// Create a new user (Admin only)
userRouter.post(
  "/admin/addNewUser",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, isAdmin } = req.body;

    // Check if user already exists
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "Felhasználó már létezik" });
      return;
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Create user
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      isAdmin,
    });

    // Save user and respond
    const createdUser = await user.save();
    res.status(201).json({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      token: generateToken(createdUser), // opciónális
    });
  })
);

// Update user (Admin only)
userRouter.put(
  "/admin/updateUser/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = req.body.isAdmin;
      // Ensure not to overwrite the password unless it's provided
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "Nincs ilyen felhasználó" });
    }
  })
);

// Delete user (Admin only)
userRouter.delete(
  "/admin/deleteUser/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (user) {
      res.json({ message: "Felhasználó törölve" });
    } else {
      res.status(404).json({ message: "Nincs ilyen felhasználó" });
    }
  })
);

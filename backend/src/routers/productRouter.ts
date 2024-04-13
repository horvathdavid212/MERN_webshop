import express, { Request, Response } from "express";
import { ProductModel } from "../models/productModel";
import asyncHandler from "express-async-handler";
import { SortOrder } from "mongoose";
import { UserModel } from "../models/userModel";
import { isAdmin, isAuth } from "../utils";

export const productRouter = express.Router();

productRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const products = await ProductModel.find();
    res.json(products);
  })
);

productRouter.get(
  "/categories",
  asyncHandler(async (req: Request, res: Response) => {
    const categories = await ProductModel.find().distinct("category");
    res.json(categories);
  })
);

productRouter.get(
  "/search",
  asyncHandler(async (req: Request, res: Response) => {
    const category = req.query.category ? { category: req.query.category } : {};
    const searchKeyword = req.query.searchKeyword
      ? {
          name: {
            $regex: req.query.searchKeyword,
            $options: "i",
          },
        }
      : {};
    const sortOrder: { [key: string]: SortOrder | { $meta: unknown } } = req
      .query.sortOrder
      ? req.query.sortOrder === "lowest"
        ? { price: 1 }
        : { price: -1 }
      : { _id: -1 };
    const products = await ProductModel.find({
      ...category,
      ...searchKeyword,
    }).sort(sortOrder);
    res.json(products);
  })
);

// Submit a rating for a product
productRouter.post(
  "/rate/:productId",
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { userId, rating } = req.body;

    const product = await ProductModel.findById(productId);
    if (!product) {
      res.status(404).json({ message: "A termék nem található" });
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "A felhasználó nem található" });
      return;
    }

    const existingRatingIndex = product.ratings.findIndex(
      (r) => r.user.toString() === userId
    );

    if (existingRatingIndex > -1) {
      product.ratings[existingRatingIndex].rating = rating;
    } else {
      product.ratings.push({ user: userId, rating });
    }

    const totalRating = product.ratings.reduce(
      (acc, curr) => acc + curr.rating,
      0
    );
    product.rating = totalRating / product.ratings.length;

    product.reviewCount = product.ratings.length;

    await product.save();

    res.status(201).json({ message: "A termék értékelése frissítve", product });
  })
);

productRouter.get(
  "/ratings/:productId",
  asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;

    console.log(productId);

    const product = await ProductModel.findById(productId).populate(
      "ratings.user",
      "name"
    );

    console.log(product);

    if (!product) {
      res.status(404).json({ message: "A termék nem található" });
      return;
    }

    res.json(product!.ratings);
  })
);

// termékek kezelése (ADMIN) -----------------------------------------------------

// Get all products (Admin only)
productRouter.get(
  "/admin/getProducts",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const products = await ProductModel.find();
    res.json(products);
  })
);

// Get product by id (Admin only)
productRouter.get(
  "/admin/getProduct/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductModel.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Termék nem található" });
    }
  })
);

// Add new product (Admin only)
productRouter.post(
  "/admin/addNewProduct",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const {
      name,
      slug,
      image,
      brand,
      category,
      description,
      price,
      countInStock,
    } = req.body;

    const productExists = await ProductModel.findOne({ slug });
    if (productExists) {
      res
        .status(400)
        .json({ message: "Ezzel a slug-al már létezik ilyen termék" });
      return;
    }

    const product = new ProductModel({
      name,
      slug,
      image,
      brand,
      category,
      description,
      price,
      countInStock,
      rating: 0,
      reviewCount: 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  })
);

// Update product (Admin only)
productRouter.put(
  "/admin/updateProduct/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const {
      name,
      slug,
      image,
      brand,
      category,
      description,
      price,
      countInStock,
    } = req.body;

    const product = await ProductModel.findById(req.params.id);
    if (product) {
      product.name = name;
      product.slug = slug;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.description = description;
      product.price = price;
      product.countInStock = countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Termék nem található" });
    }
  })
);

// Delete product (Admin only)
productRouter.delete(
  "/admin/deleteProduct/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductModel.findById(req.params.id);
    if (product) {
      await ProductModel.deleteOne({ _id: product._id });
      res.json({ message: "Termék törölve" });
    } else {
      res.status(404).json({ message: "Termék nem található" });
    }
  })
);

// kategóriák kezelése (ADMIN) -----------------------------------------------------

// Get all categories (Admin only)

productRouter.get(
  "/admin/getCategories",
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const categories = await ProductModel.find().distinct("category");
    res.json(categories);
  })
);

// Get category by id (Admin only)

productRouter.get(
  "/admin/getCategory/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req, res) => {
    const category = await ProductModel.findById(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: "Kategória nem található" });
    }
  })
);

// Add new category (Admin only)

productRouter.post(
  "/admin/addNewCategory",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const { category } = req.body;

    const categoryExists = await ProductModel.findOne({ category });
    if (categoryExists) {
      res.status(400).json({ message: "Ez a kategória már létezik" });
      return;
    }

    const newCategory = new ProductModel({ category });

    const createdCategory = await newCategory.save();
    res.status(201).json(createdCategory);
  })
);

// Update category (Admin only)

// productRouter.put(
//   "/admin/updateCategory/:id",
//   isAuth,
//   isAdmin,
//   asyncHandler(async (req: Request, res: Response) => {
//     const { category } = req.body;

//     const updatedCategory = await ProductModel.findById(req.params.id);
//     if (updatedCategory) {
//       updatedCategory.category = category;

//       const category = await updatedCategory.save();
//       res.json(category);
//     } else {
//       res.status(404).json({ message: "Kategória nem található" });
//     }
//   })
// );

productRouter.put(
  "/admin/updateProduct/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const {
      name,
      slug,
      image,
      brand,
      category,
      description,
      price,
      countInStock,
    } = req.body;

    const product = await ProductModel.findById(req.params.id);
    if (product) {
      product.name = name;
      product.slug = slug;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.description = description;
      product.price = price;
      product.countInStock = countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Termék nem található" });
    }
  })
);

// Delete category (Admin only)

productRouter.delete(
  "/admin/deleteCategory/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const category = await ProductModel.findById(req.params.id);
    if (category) {
      await ProductModel.deleteOne({ _id: category._id });
      res.json({ message: "Kategória törölve" });
    } else {
      res.status(404).json({ message: "Kategória nem található" });
    }
  })
);

productRouter.get(
  "/:slug/:slug",
  asyncHandler(async (req, res) => {
    const product = await ProductModel.findOne({ slug: req.params.slug });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "A termék nem található" });
    }
  })
);

productRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const product = await ProductModel.findOne({ slug: req.params.slug });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "A termék nem található" });
    }
  })
);

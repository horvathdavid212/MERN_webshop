import {
  modelOptions,
  prop,
  getModelForClass,
  Ref,
} from "@typegoose/typegoose";
import { Product } from "./productModel";

class RatedProduct {
  @prop({ ref: "Product" })
  product!: Ref<Product>;

  @prop({ required: true, min: 1, max: 5 })
  rating!: number;
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  public _id?: string;
  @prop({ required: true })
  public name!: string;
  @prop({ required: true, unique: true })
  public email!: string;
  @prop({ required: true })
  public password!: string;
  @prop({ required: true, default: false })
  public isAdmin!: boolean;
  @prop({ ref: "Product", default: [] })
  public favorites!: Ref<Product>[];
  @prop({ type: () => [RatedProduct], default: [] })
  public ratedProducts!: RatedProduct[];
}

export const UserModel = getModelForClass(User);

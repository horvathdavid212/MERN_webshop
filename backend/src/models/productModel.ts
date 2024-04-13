import {
  modelOptions,
  prop,
  getModelForClass,
  Ref,
} from "@typegoose/typegoose";
import { User } from "./userModel";

class Rating {
  @prop({ ref: () => User })
  user!: Ref<User>;

  @prop({ required: true, min: 1, max: 5 })
  rating!: number;
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Product {
  public _id?: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true, unique: true })
  public slug!: string;

  @prop({ required: true })
  public image!: string;

  @prop({ required: true })
  public brand!: string;

  @prop({ required: true })
  public category!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ required: true, default: 0 })
  public price!: number;

  @prop({ required: true, default: 0 })
  public countInStock!: number;

  @prop({ required: true, default: 0 })
  public rating?: number;

  @prop({ required: true, default: 0 })
  public reviewCount?: number;

  @prop({ type: () => [Rating], default: [] })
  public ratings!: Rating[];
}

export const ProductModel = getModelForClass(Product);

import {
  modelOptions,
  prop,
  getModelForClass,
  mongoose,
  Ref,
} from "@typegoose/typegoose";
import { User } from "./userModel";

@modelOptions({ schemaOptions: { timestamps: true } })
class Coupon {
  @prop({ required: true, unique: true })
  public code!: string;

  @prop({ required: true })
  public discount!: number;

  @prop({ required: true })
  public expiryDate!: Date;

  @prop({ default: true })
  public isActive!: boolean;

  @prop({
    type: () => [mongoose.Schema.Types.ObjectId],
    ref: () => User,
    default: [],
  })
  public usersRedeemed!: Ref<User>[];
}

export const CouponModel = getModelForClass(Coupon);

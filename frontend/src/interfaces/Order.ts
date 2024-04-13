import { CartItem, ShippingAddress } from "./Cart";
import { UserInfo } from "./UserInfo";

export interface Order {
  _id: string;
  orderItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  user: UserInfo;
  createdAt: string;
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  couponCode?: string;
}

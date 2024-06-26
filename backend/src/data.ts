import bcrypt from "bcryptjs";
import { User } from "./models/userModel";
import { Product } from "./models/productModel";

export const sampleUsers: User[] = [
  {
    name: "Kiss Pista",
    email: "kiss.pista@gmnail.com",
    password: bcrypt.hashSync("kp", 10),
    isAdmin: false,
    favorites: [],
    ratedProducts: [],
  },
  {
    name: "Nagy Béla",
    email: "nagy.bela@gmail.com",
    password: bcrypt.hashSync("nb", 10),
    isAdmin: false,
    favorites: [],
    ratedProducts: [],
  },
  {
    name: "Nagy Éva",
    email: "nagy.eva@gmail.com",
    password: bcrypt.hashSync("ne", 10),
    isAdmin: false,
    favorites: [],
    ratedProducts: [],
  },
  {
    name: "Kovács János",
    email: "kovacs.janos@gmail.com",
    password: bcrypt.hashSync("kj", 10),
    isAdmin: false,
    favorites: [],
    ratedProducts: [],
  },
];

export const testProducts: Product[] = [
  {
    name: "Xbox Series X",
    slug: "xbox-series-x",
    category: "Gaming",
    image: "../images/x1.jpg",
    price: 119990,
    countInStock: 7,
    brand: "Microsoft",
    rating: 4.5,
    reviewCount: 12,
    description:
      "Az Xbox Series X egy játékkonzol, amelyet a Microsoft fejlesztett ki és gyártott. A Series X a Microsoft Xbox sorozatának egyik tagja, és a 2017-ben megjelent Xbox One X utódja. A Series X 2020 novemberében jelent meg.",
    ratings: [],
  },
  {
    name: "Nintendo Switch",
    slug: "nintendo-switch",
    category: "Gaming",
    image: "../images/x2.jpg",
    price: 79990,
    countInStock: 5,
    brand: "Nintendo",
    rating: 4.8,
    reviewCount: 23,
    description:
      "A Nintendo Switch egy hibrid videojáték-konzol, amelyet a Nintendo fejlesztett ki és gyártott. A Nintendo Switch 2017 márciusában jelent meg. A Nintendo Switch egy olyan konzol, amely lehetővé teszi a felhasználók számára, hogy otthon vagy útközben is játsszanak.",
    ratings: [],
  },
  {
    name: "Apple iPhone 12",
    slug: "iphone-12",
    category: "Mobiltelefon",
    image: "../images/x3.jpg",
    price: 349990,
    countInStock: 10,
    brand: "Apple",
    rating: 4.9,
    reviewCount: 15,
    description:
      "Az iPhone 12 az Apple Inc. által tervezett és gyártott okostelefon. Az iPhone 12 az iPhone 11 utódja, és 2020 októberében jelent meg. Az iPhone 12 számos új funkciót és fejlesztést kínál az előző modellekhez képest.",
    ratings: [],
  },
  {
    name: "Huawei P40 Pro",
    slug: "huawei-p40-pro",
    category: "Mobiltelefon",
    image: "../images/x4.jpg",
    price: 259990,
    countInStock: 6,
    brand: "Huawei",
    rating: 4.3,
    reviewCount: 8,
    description:
      "A Huawei P40 Pro egy okostelefon, amelyet a Huawei Technologies fejlesztett ki és gyártott. A P40 Pro a Huawei P sorozatának egyik tagja, és a P30 Pro utódja. A P40 Pro 2020 áprilisában jelent meg.",
    ratings: [],
  },
  {
    name: "Samsung Galaxy Tab S7",
    slug: "samsung-galaxy-tab-s7",
    category: "Tablet",
    image: "../images/x5.jpg",
    price: 199990,
    countInStock: 4,
    brand: "Samsung",
    rating: 4.4,
    reviewCount: 6,
    description:
      "A Samsung Galaxy Tab S7 egy tablet, amelyet a Samsung Electronics fejlesztett ki és gyártott. A Galaxy Tab S7 a Samsung Galaxy Tab sorozatának egyik tagja, és a Galaxy Tab S6 utódja. A Galaxy Tab S7 2020 augusztusában jelent meg.",
    ratings: [],
  },
  {
    name: "LG 27GL850-B",
    slug: "lg-27gl850-b",
    category: "Monitor",
    image: "../images/x6.jpg",
    price: 169990,
    countInStock: 3,
    brand: "LG",
    rating: 4.7,
    reviewCount: 9,
    description:
      "Az LG 27GL850-B egy prémium minőségű monitor, amelyet a LG Electronics fejlesztett ki és gyártott. Ez a monitor kiváló képminőséget és széles betekintési szöget kínál, valamint támogatja a magas képfrissítési rátát és az adaptív szinkronizációt.",
    ratings: [],
  },
  {
    name: "Dell U2720Q",
    slug: "dell-u2720q",
    category: "Monitor",
    image: "../images/x7.jpg",
    price: 219990,
    countInStock: 5,
    brand: "Dell",
    rating: 4.6,
    reviewCount: 7,
    description:
      "A Dell U2720Q egy professzionális monitor, amelyet a Dell Technologies fejlesztett ki és gyártott. Ez a monitor kiváló színminőséget és részletességet kínál, valamint támogatja a magas felbontást és a széles színtartományt.",
    ratings: [],
  },
  {
    name: "AOC CQ32G1",
    slug: "aoc-cq32g1",
    category: "Monitor",
    image: "../images/x8.jpg",
    price: 99990,
    countInStock: 8,
    brand: "AOC",
    rating: 4.5,
    reviewCount: 11,
    description:
      "Az AOC CQ32G1 egy játékosoknak szánt monitor, amelyet az AOC International fejlesztett ki és gyártott. Ez a monitor nagy képernyővel és ívelt kialakítással rendelkezik, valamint támogatja a magas képfrissítési rátát és az adaptív szinkronizációt.",
    ratings: [],
  },
];

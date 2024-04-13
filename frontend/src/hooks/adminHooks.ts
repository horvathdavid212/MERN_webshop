import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";

// -------Coupons CRUD--------

// Fetch all coupons
export const useGetAllCoupons = () => {
  return useQuery({
    queryKey: ["getAllCoupons"],
    queryFn: async () => (await apiClient.get("api/coupons/admin/getAll")).data,
  });
};

// Fetch a single coupon by ID
export const useGetCoupon = (couponId: number) => {
  return useQuery({
    queryKey: ["getCoupon", couponId],
    queryFn: async () =>
      (await apiClient.get(`api/coupons/admin/getOne/${couponId}`)).data,
  });
};

// Create a new coupon
export const useAddNewCoupon = () => {
  return useMutation({
    mutationFn: async (newCoupon) =>
      (await apiClient.post("api/coupons/admin/addNewCoupon", newCoupon)).data,
  });
};

// Update a coupon
export const useUpdateCoupon = () => {
  return useMutation({
    mutationFn: async ({
      id,
      updatedCoupon,
    }: {
      id: number;
      updatedCoupon: any;
    }) =>
      (
        await apiClient.put(
          `api/coupons/admin/updateCoupon/${id}`,
          updatedCoupon
        )
      ).data,
  });
};

// Delete a coupon
export const useDeleteCoupon = () => {
  return useMutation({
    mutationFn: async (couponId) =>
      (await apiClient.delete(`api/coupons/admin/deleteCoupon/${couponId}`))
        .data,
  });
};

// --------------------------------

// -------Users CRUD--------

// Fetch all users
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["getAllUsers"],
    queryFn: async () =>
      (await apiClient.get("/api/users/admin/getAllUsers")).data,
  });
};

// Fetch a single user by ID
export const useGetUser = (userId: string) => {
  return useQuery({
    queryKey: ["getUser", userId],
    queryFn: async () =>
      (await apiClient.get(`/api/users/admin/getUser/${userId}`)).data,
  });
};

// Create a new user
export const useAddNewUser = () => {
  return useMutation({
    mutationFn: async (newUser: {
      name: string;
      email: string;
      password: string;
      isAdmin: boolean;
    }) => (await apiClient.post("/api/users/admin/addNewUser", newUser)).data,
  });
};

// Update a user
export const useUpdateUser = () => {
  return useMutation({
    mutationFn: async ({
      id,
      updatedUser,
    }: {
      id: string;
      updatedUser: {
        name?: string;
        email?: string;
        password?: string;
        isAdmin?: boolean;
      };
    }) =>
      (await apiClient.put(`/api/users/admin/updateUser/${id}`, updatedUser))
        .data,
  });
};

// Delete a user
export const useDeleteUser = () => {
  return useMutation({
    mutationFn: async (userId: string) =>
      (await apiClient.delete(`/api/users/admin/deleteUser/${userId}`)).data,
  });
};

// -------Orders CRUD--------

// Fetch all orders
export const useGetAllOrders = () => {
  return useQuery({
    queryKey: ["getAllOrders"],
    queryFn: async () =>
      (await apiClient.get("/api/orders/admin/getAllOrders")).data,
  });
};

// Fetch a single order by ID
export const useGetOrder = () => {
  return useMutation({
    mutationFn: async (orderId: string) =>
      (await apiClient.get(`/api/orders/admin/getOrder/${orderId}`)).data,
  });
};

// Update an order to delivered
export const useUpdateOrderToDelivered = () => {
  return useMutation({
    mutationFn: async (orderId: string) =>
      (
        await apiClient.put(
          `/api/orders/admin/updateOrderToDelivered/${orderId}`
        )
      ).data,
  });
};

// Delete an order
export const useDeleteOrder = () => {
  return useMutation({
    mutationFn: async (orderId: string) =>
      (await apiClient.delete(`/api/orders/admin/deleteOrder/${orderId}`)).data,
  });
};

// -------Products CRUD--------

// Fetch all products
export const useGetAllProducts = () => {
  return useQuery({
    queryKey: ["getAllProducts"],
    queryFn: async () =>
      (await apiClient.get("/api/products/admin/getProducts")).data,
  });
};

// Fetch a single product by ID

export const useGetProduct = (productId: string) => {
  return useQuery({
    queryKey: ["getProduct", productId],
    queryFn: async () =>
      (await apiClient.get(`/api/products/admin/getProduct/${productId}`)).data,
  });
};

// Create a new product

export const useAddNewProduct = () => {
  return useMutation({
    mutationFn: async (newProduct) =>
      (await apiClient.post("/api/products/admin/addNewProduct", newProduct))
        .data,
  });
};

// Update a product

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: async ({
      id,
      updatedProduct,
    }: {
      id: string;
      updatedProduct: any;
    }) =>
      (
        await apiClient.put(
          `/api/products/admin/updateProduct/${id}`,
          updatedProduct
        )
      ).data,
  });
};

// Delete a product

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: async (productId: string) =>
      (await apiClient.delete(`/api/products/admin/deleteProduct/${productId}`))
        .data,
  });
};

// -------Categories CRUD--------

// Fetch all categories

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ["getAllCategories"],
    queryFn: async () => (await apiClient.get("/api/admin/categories")).data,
  });
};

// Fetch a single category by ID

// Create a new category

// Update a category

// Delete a category

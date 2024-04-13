import { useMutation, useQuery } from "@tanstack/react-query";
import { Product } from "../interfaces/Product";
import apiClient from "../apiClient";

export const useGetProductsQuery = (
  category?: string,
  searchKeyword?: string
) =>
  useQuery({
    queryKey: ["products", category, searchKeyword],
    queryFn: async () => {
      let url = "api/products";
      const params = new URLSearchParams();

      if (category) params.append("category", category);
      if (searchKeyword) params.append("searchKeyword", searchKeyword);

      if (params.toString()) url += `/search?${params.toString()}`;

      return (await apiClient.get<Product[]>(url)).data;
    },
  });

export const useGetProductDetailsBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ["products", slug],
    queryFn: async () =>
      (await apiClient.get<Product>(`api/products/${slug}`)).data,
  });

export const useGetCategoriesQuery = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () =>
      (await apiClient.get<string[]>(`/api/products/categories`)).data,
  });

// RATING HOOKS
export const useGetProductRatingsQuery = (productId: string) =>
  useQuery({
    queryKey: ["productRatings", productId],
    queryFn: async () =>
      (await apiClient.get(`/api/products/ratings/${productId}`)).data,
  });

export const useRateProduct = () =>
  useMutation({
    mutationFn: async ({
      productId,
      userId,
      rating,
    }: {
      productId: string;
      userId: string;
      rating: number;
    }) =>
      (
        await apiClient.post(`/api/products/rate/${productId}`, {
          userId,
          rating,
        })
      ).data,
  });

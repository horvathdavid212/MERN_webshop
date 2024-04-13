import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";

export const useAddToFavoritesMutation = () =>
  useMutation({
    mutationFn: async (productId: string) =>
      (await apiClient.post(`/api/users/favorites/add`, { productId })).data,
  });

export const useRemoveFromFavoritesMutation = () =>
  useMutation({
    mutationFn: async (productId: string) =>
      (await apiClient.post(`/api/users/favorites/remove`, { productId })).data,
  });

export const useGetFavoriteProductsQuery = () =>
  useQuery({
    queryKey: ["favoriteProducts"],
    queryFn: async () => (await apiClient.get("/api/users/favorites")).data,
  });

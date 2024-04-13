import { useMutation } from "@tanstack/react-query";
import apiClient from "../apiClient";

export const useValidateCouponMutation = () =>
  useMutation({
    mutationFn: async (couponCode: string) =>
      (
        await apiClient.post(`/api/coupons/validate`, {
          code: couponCode,
        })
      ).data,
  });

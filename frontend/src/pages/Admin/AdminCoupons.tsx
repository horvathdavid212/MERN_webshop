import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useGetAllCoupons,
  useAddNewCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
} from "../../hooks/adminHooks";

interface Coupon {
  _id: number;
  code: string;
  discount: number;
  expiryDate: string;
}

const AdminCoupons = () => {
  const [couponData, setCouponData] = useState({
    code: "",
    discount: "",
    expiryDate: "",
  });
  const [editingCouponId, setEditingCouponId] = useState<number | null>(null);

  const { data: coupons, refetch } = useGetAllCoupons();
  const addNewCouponMutation = useAddNewCoupon();
  const updateCouponMutation = useUpdateCoupon();
  const deleteCouponMutation = useDeleteCoupon();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponData({ ...couponData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setCouponData({ code: "", discount: "", expiryDate: "" });
    setEditingCouponId(null);
  };

  const handleAddCoupon = () => {
    addNewCouponMutation.mutate(couponData, {
      onSuccess: () => {
        refetch();
        resetForm();
      },
    });
  };

  const handleUpdateCoupon = () => {
    if (editingCouponId) {
      updateCouponMutation.mutate(
        {
          id: editingCouponId,
          updatedCoupon: {
            ...couponData,
            discount: parseFloat(couponData.discount),
          },
        },
        {
          onSuccess: () => {
            refetch();
            resetForm();
          },
        }
      );
    }
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCouponId(coupon._id);
    setCouponData({
      code: coupon.code,
      discount: coupon.discount.toString(),
      expiryDate: coupon.expiryDate.split("T")[0],
    });
  };

  const handleDeleteCoupon = (couponId: number) => {
    deleteCouponMutation.mutate(couponId, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Kuponok Kezelése
      </Typography>
      <Box display="flex" gap={2} marginBottom={2}>
        <TextField
          name="code"
          label="Kuponkód"
          variant="outlined"
          value={couponData.code}
          onChange={handleChange}
        />
        <TextField
          name="discount"
          label="Kedvezmény"
          type="number"
          variant="outlined"
          value={couponData.discount}
          onChange={handleChange}
        />
        <TextField
          name="expiryDate"
          label="Lejárati Dátum"
          type="date"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={couponData.expiryDate}
          onChange={handleChange}
        />
        {editingCouponId ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUpdateCoupon}
          >
            Kupon Frissítése
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleAddCoupon}>
            Új Kupon
          </Button>
        )}
        {editingCouponId && (
          <Button variant="outlined" color="error" onClick={resetForm}>
            Mégsem
          </Button>
        )}
      </Box>

      <List>
        {coupons?.map((coupon: Coupon) => (
          <ListItem key={coupon._id}>
            <ListItemText
              primary={coupon.code}
              secondary={`Kedvezmény: ${coupon.discount}% - Lejárat: ${
                coupon.expiryDate.split("T")[0]
              }`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => handleEditCoupon(coupon)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteCoupon(coupon._id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AdminCoupons;

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useGetAllOrders,
  useGetOrder,
  useUpdateOrderToDelivered,
  useDeleteOrder,
} from "../../hooks/adminHooks";
import { Order } from "../../interfaces/Order";
import LoadingBox from "../../components/LoadingBox";
import MessageBox from "../../components/MessageBox";

const AdminOrders = () => {
  const { data: orders, isLoading, isError, refetch } = useGetAllOrders();
  const updateOrderToDelivered = useUpdateOrderToDelivered();
  const deleteOrder = useDeleteOrder();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [openDialog, setOpenDialog] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders?.filter((order: Order) =>
    order._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (orderId: string) => {
    orders.forEach((order: Order) => {
      if (order._id === orderId) {
        setSelectedOrder(order);
      }
    });
    handleopenDialog();
  };

  const handleMarkDelivered = (orderId: string) => {
    updateOrderToDelivered.mutate(orderId, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleDelete = (orderId: string) => {
    deleteOrder.mutate(orderId, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  if (isLoading) return <LoadingBox />;
  if (isError)
    return <MessageBox variant="error">{isError.toString()}</MessageBox>;

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleopenDialog = () => {
    setOpenDialog(true);
  };

  //   console.log(selectedOrder && selectedOrder._id);

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Rendelések Kezelése
      </Typography>
      <TextField
        label="Keresés Rendelés ID alapján"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Paper elevation={3}>
        <List>
          {filteredOrders.map((order: Order) => (
            <ListItem
              key={order._id}
              secondaryAction={
                <>
                  <IconButton
                    edge="end"
                    onClick={() => handleMarkDelivered(order._id)}
                  >
                    {order.isDelivered ? (
                      <CheckCircleIcon sx={{ color: "green" }} />
                    ) : (
                      <CheckCircleOutlineIcon />
                    )}
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDelete(order._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={`Rendelés ID: ${order._id}`}
                secondary={`Státusz: ${
                  order.isDelivered ? "Kiszállítva" : "Feldolgozás alatt"
                }`}
              />
              <Button
                sx={{ mr: 3 }}
                onClick={() => handleViewDetails(order._id)}
              >
                Részletek
              </Button>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Rendelés részletei</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <Typography>Rendelés azonosító: {selectedOrder._id}</Typography>
              <Typography>
                Státusz:{" "}
                {selectedOrder.isDelivered
                  ? "Kiszállítva"
                  : "Feldolgozás alatt"}
              </Typography>
              <Typography>
                Kiszállítás dátuma:{" "}
                {selectedOrder.deliveredAt &&
                  new Date(selectedOrder.deliveredAt).toLocaleString()}
              </Typography>
              <Typography>
                Fizetési módszer: {selectedOrder.paymentMethod}
              </Typography>
              <Typography>Felhasználó: {selectedOrder.user.name}</Typography>
              <Typography>
                Rendelés dátuma:{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </Typography>
              <Typography>
                Fizetve: {selectedOrder.isPaid ? "Igen" : "Nem"}
              </Typography>
              {selectedOrder.isPaid && (
                <Typography>
                  Fizetés dátuma:{" "}
                  {new Date(selectedOrder.paidAt).toLocaleString()}
                </Typography>
              )}
              <Typography>
                Termékek ára: {selectedOrder.itemsPrice} Ft
              </Typography>
              <Typography>
                Szállítási díj: {selectedOrder.shippingPrice} Ft
              </Typography>
              <Typography>
                Teljes összeg: {selectedOrder.totalPrice} Ft
              </Typography>
              {selectedOrder.couponCode && (
                <Typography>Kuponkód: {selectedOrder.couponCode}</Typography>
              )}

              <Typography>Szállítási cím:</Typography>
              <Typography>{selectedOrder.shippingAddress.fullName}</Typography>
              <Typography>
                {selectedOrder.shippingAddress.address},{" "}
                {selectedOrder.shippingAddress.city}
              </Typography>
              <Typography>
                {selectedOrder.shippingAddress.postalCode}
              </Typography>

              <Typography>Rendelt termékek:</Typography>
              {selectedOrder.orderItems.map((item) => (
                <div key={item._id}>
                  <Typography>Termék neve: {item.name}</Typography>
                  <Typography>Mennyiség: {item.quantity}</Typography>
                  <Typography>Ár: {item.price} Ft</Typography>
                </div>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Bezár</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminOrders;

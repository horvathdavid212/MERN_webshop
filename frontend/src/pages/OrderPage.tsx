import React, { useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { Store } from "../Store";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from "../hooks/orderHooks";
import { ApiError } from "../interfaces/ApiError";
import { getError } from "../utils";
import { toast } from "react-toastify";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Button,
  Box,
} from "@mui/material";

export default function OrderPage() {
  // const { state } = useContext(Store);

  const params = useParams();
  const { id: orderId } = params;

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderDetailsQuery(orderId!);

  // const { mutateAsync: payOrder, isPending: loadingPay } =
  //   usePayOrderMutation();

  useEffect(() => {
    console.log("totalPrice: ", order?.totalPrice);
  }, []);
  useEffect(() => {
    console.log("order.shippingPrice: ", order?.shippingPrice);
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Helmet>
        <title>Rendelés {orderId}</title>
      </Helmet>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Rendelés {orderId}
      </Typography>
      {isLoading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="error">{getError(error as ApiError)}</MessageBox>
      ) : !order ? (
        <MessageBox variant="error">A rendelés nem található</MessageBox>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Szállítás
                </Typography>
                <Typography variant="body1">
                  <strong>Név:</strong> {order!.shippingAddress.fullName} <br />
                  <strong>Szállítási cím:</strong>{" "}
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                </Typography>
                {order.isDelivered ? (
                  <MessageBox variant="success">Kiszállítva</MessageBox>
                ) : (
                  <MessageBox variant="warning">Szállítás alatt</MessageBox>
                )}
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Fizetés
                </Typography>
                <Typography variant="body1">
                  <strong>Mód:</strong> {order.paymentMethod}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Termékek
                </Typography>
                <List>
                  {order.orderItems.map((item) => (
                    <ListItem key={item._id} divider>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: "100%",
                              height: "auto",
                              maxWidth: "80px",
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body1">
                            <Link
                              to={`/product/${item.slug}`}
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              {item.name}
                            </Link>
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="body2">
                            {item.quantity} db
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography variant="body2">
                            {item.price} ft
                          </Typography>
                        </Grid>
                      </Grid>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Összesítő
                </Typography>
                <List>
                  <ListItem>
                    <Grid container justifyContent="space-between">
                      <Grid item>Termék</Grid>
                      <Grid item>{order.itemsPrice} ft</Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container justifyContent="space-between">
                      <Grid item>Szállítás</Grid>
                      <Grid item>
                        {order.itemsPrice > 50000 ? (
                          <>
                            <Typography
                              variant="body2"
                              component="span"
                              sx={{ textDecoration: "line-through", mr: 1 }}
                            >
                              1990 ft
                            </Typography>
                            <Typography variant="body2" component="span">
                              0 ft
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="body2">
                            {order.shippingPrice} ft
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container justifyContent="space-between">
                      <Grid item>
                        <strong>Teljes összeg</strong>
                      </Grid>
                      <Grid item>
                        <strong>{order.totalPrice} ft</strong>
                      </Grid>
                    </Grid>
                  </ListItem>
                </List>
              </CardContent>
              <ListItem>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "success.main",
                  }}
                >
                  <CheckCircleOutlineIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" component="span">
                    Rendelés sikeresen leadva!
                  </Typography>
                </Box>
              </ListItem>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import CheckoutSteps from "../components/CheckoutSteps";
import {
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import LoadingBox from "../components/LoadingBox";
import {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../hooks/orderHooks";
import { ApiError } from "../interfaces/ApiError";
import { getError } from "../utils";
import {
  PayPalButtons,
  PayPalButtonsComponentProps,
  SCRIPT_LOADING_STATE,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useValidateCouponMutation } from "../hooks/couponHooks";

const PlaceOrderPage = () => {
  const navigate = useNavigate();

  const { state, dispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const [showPaypalButtons, setShowPaypalButtons] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>("");

  const { mutate: validateCoupon, isError } = useValidateCouponMutation();
  const [couponCode, setCouponCode] = useState("");
  const [discountInfo, setDiscountInfo] = useState({
    isValid: false,
    discount: 0,
  });

  const handleCouponValidation = async () => {
    validateCoupon(couponCode, {
      onSuccess: (data) => {
        setDiscountInfo({ isValid: true, discount: data.discount });
        toast.success(data.discount + " %-os kupon sikeresen felhasználva");
      },
      onError: (err) => {
        toast.error(getError(err as ApiError));
      },
    });
  };

  cart.itemsPrice = cart.cartItems.reduce(
    (a, c) => a + c.quantity * c.price,
    0
  );

  let discountAmount = 0;
  cart.shippingPrice = cart.itemsPrice > 50000 ? 0 : 1990;

  if (discountInfo.isValid) {
    const discountAmount = Math.floor(
      cart.itemsPrice * (discountInfo.discount / 100)
    );
    cart.totalPrice = cart.itemsPrice - discountAmount + cart.shippingPrice;
  } else {
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice;
  }

  const { mutateAsync: createOrder, isPending } = useCreateOrderMutation();

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderDetailsQuery(createdOrderId!);

  const placeOrderHandler = async () => {
    try {
      const data = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
        couponCode: discountInfo.isValid ? couponCode : "",
      });

      if (cart.paymentMethod === "Utánvét") {
        dispatch({ type: "CART_CLEAR" });
        localStorage.removeItem("cartItems");
        navigate(`/order/${data.order._id}`);
      } else if (cart.paymentMethod === "PayPal") {
        setCreatedOrderId(data.order._id);
        setShowPaypalButtons(true);
      }
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);

  const testPayHandler = async () => {
    await payOrder({ orderId: createdOrderId! });
    refetch();
    toast.success("Rendelés fizetve");
    dispatch({ type: "CART_CLEAR" });
    localStorage.removeItem("cartItems");
    navigate(`/order/${createdOrderId}`);
  };

  const { mutateAsync: payOrder, isPending: loadingPay } =
    usePayOrderMutation();

  const [{ isPayPalPending, isPayPalRejected }, paypalDispatch] =
    usePayPalScriptReducer();
  const { data: paypalConfig } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (paypalConfig && paypalConfig.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            clientId: paypalConfig!.clientId,
            currency: "HUF",
          },
        });
        paypalDispatch({
          type: "setLoadingStatus",
          value: SCRIPT_LOADING_STATE.PENDING,
        });
      };
      loadPaypalScript();
    }
  }, [paypalConfig]);

  console.log(cart);

  const paypalbuttonTransactionProps: PayPalButtonsComponentProps = {
    style: { layout: "vertical" },
    createOrder(data, actions) {
      return actions.order
        .create({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "HUF",
                value: order!.totalPrice.toString(),
              },
            },
          ],
        })
        .then((orderID: string) => {
          return orderID;
        });
    },
    onApprove(data, actions) {
      return actions.order!.capture().then(async (details) => {
        try {
          await payOrder({ orderId: createdOrderId!, ...details });
          refetch();
          toast.success("Rendelés fizetve");
        } catch (err) {
          toast.error(getError(err as ApiError));
        }
      });
    },
    onError: (err) => {
      toast.error(getError(err as ApiError));
    },
  };

  useEffect(() => {
    console.log(cart.totalPrice);
  }, [cart.totalPrice]);

  return (
    <div>
      <CheckoutSteps step4 />
      <Helmet>
        <title>Rendelés megerősítése</title>
      </Helmet>
      <Typography component="h1" variant="h4" className="my-3">
        Rendelés megerősítése
      </Typography>
      <Grid container spacing={2}>
        <Grid item md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Szállítás
              </Typography>
              <Typography variant="body1">
                <strong>Név:</strong> {cart.shippingAddress.fullName} <br />
                <strong>Szállítási cím:</strong> {cart.shippingAddress.address},{" "}
                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
              </Typography>
              <Button
                component={Link}
                to="/shipping"
                sx={{ mt: 2 }}
                variant="outlined"
              >
                Módosítás
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fizetés
              </Typography>
              <Typography variant="body1">
                <strong>Mód:</strong> {cart.paymentMethod}
              </Typography>
              <Button
                component={Link}
                to="/payment"
                sx={{ mt: 2 }}
                variant="outlined"
              >
                Módosítás
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Termékek
              </Typography>
              <List>
                {cart.cartItems.map((item) => (
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
                            style={{ textDecoration: "none", color: "inherit" }}
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
                        <Typography variant="body2">{item.price} ft</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                ))}
              </List>
              <Button
                component={Link}
                to="/cart"
                sx={{ mt: 2 }}
                variant="outlined"
              >
                Módosítás
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Összesítő</Typography>
              <List>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      Termékek
                    </Grid>
                    <Grid item xs={6}>
                      {cart.itemsPrice} ft
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <Typography variant="body1">Szállítás</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      {cart.itemsPrice > 50000 ? (
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
                          {cart.shippingPrice} ft
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <strong>Teljes összeg</strong>
                    </Grid>
                    <Grid item xs={6}>
                      <strong>{cart.totalPrice} ft</strong>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Kuponkód"
                        variant="outlined"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Írja be a kuponkódot"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleCouponValidation}
                      >
                        Alkalmaz
                      </Button>
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={placeOrderHandler}
                    disabled={cart.cartItems.length === 0 || isPending}
                  >
                    Rendelés leadása
                  </Button>
                </ListItem>
                {isPayPalPending ? (
                  <LoadingBox />
                ) : isPayPalRejected ? (
                  <Typography>A PayPal fizetési mód nem elérhető</Typography>
                ) : showPaypalButtons ? (
                  <div>
                    <PayPalButtons {...paypalbuttonTransactionProps} />
                    <Button onClick={testPayHandler}>Teszt fizetés</Button>
                  </div>
                ) : (
                  ""
                )}
              </List>
              {isPending && <LoadingBox />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default PlaceOrderPage;

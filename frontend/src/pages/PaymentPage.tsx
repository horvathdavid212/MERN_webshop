import React, { useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import CheckoutSteps from "../components/CheckoutSteps";
import {
  Container,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Typography,
} from "@mui/material";

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || "PayPal"
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    localStorage.setItem("paymentMethod", paymentMethodName);
    console.log(paymentMethodName);
    navigate("/placeorder");
  };

  return (
    <Container maxWidth="sm">
      <Helmet>
        <title>Fizetési Mód</title>
      </Helmet>

      <CheckoutSteps step3 />

      <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
        Fizetési Mód
      </Typography>

      <FormControl component="form" onSubmit={submitHandler}>
        <RadioGroup
          aria-labelledby="payment-method-label"
          name="paymentMethod"
          value={paymentMethodName}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel value="PayPal" control={<Radio />} label="PayPal" />
          <FormControlLabel value="Stripe" control={<Radio />} label="Stripe" />
          <FormControlLabel
            value="Utánvét"
            control={<Radio />}
            label="Utánvét"
          />
        </RadioGroup>
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Tovább
        </Button>
      </FormControl>
    </Container>
  );
}

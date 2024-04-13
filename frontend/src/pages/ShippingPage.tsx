import React, { useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import CheckoutSteps from "../components/CheckoutSteps";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";

export default function ShippingPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;
  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [userInfo, navigate]);

  const validateForm = () => {
    if (!fullName || !address || !city || !postalCode) {
      setError("Minden mező kitöltése kötelező.");
      return false;
    }
    setError("");
    return true;
  };

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({ fullName, address, city, postalCode })
    );
    navigate("/payment");
  };

  return (
    <Container maxWidth="sm">
      <Helmet>
        <title>Szállítási Cím</title>
      </Helmet>

      <CheckoutSteps step2 />

      <Typography component="h1" variant="h5" sx={{ my: 3 }}>
        Szállítási Cím
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="fullName"
          label="Teljes Név"
          name="fullName"
          autoComplete="fullName"
          autoFocus
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="postalCode"
          label="Irányítószám"
          name="postalCode"
          autoComplete="postalCode"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="city"
          label="Város"
          name="city"
          autoComplete="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="address"
          label="Utca, házszám"
          name="address"
          autoComplete="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Tovább
        </Button>
      </Box>
    </Container>
  );
}

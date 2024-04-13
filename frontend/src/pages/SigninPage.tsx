import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import { useSigninMutation } from "../hooks/userHooks";
import { ApiError } from "../interfaces/ApiError";
import { getError } from "../utils";
import {
  Container,
  TextField,
  Button,
  Link,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

export default function SigninPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const { mutateAsync: signin, isPending } = useSigninMutation();

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const data = await signin({
        email,
        password,
      });
      dispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect);
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container component="main" maxWidth="xs">
      <Helmet>
        <title>Belépés</title>
      </Helmet>
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Belépés
        </Typography>
        <Box
          component="form"
          onSubmit={submitHandler}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Cím"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Jelszó"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isPending}
          >
            Belépés
          </Button>
          {isPending && (
            <CircularProgress
              size={24}
              sx={{ display: "flex", justifyContent: "center" }}
            />
          )}
          Új vásárló?{" "}
          <Link
            component={RouterLink}
            to={`/signup?redirect=${redirect}`}
            variant="body2"
          >
            {"Hozzon létre új fiókot"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
